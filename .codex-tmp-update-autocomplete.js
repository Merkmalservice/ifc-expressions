const fs = require("fs");
const path = "src\\autocomplete\\IfcExpressionAutocomplete.ts";
let s = fs.readFileSync(path, "utf8");
s = s.replace(
  `type CallFrame = {
  kind: "function" | "group" | "array";
  name?: string;
  argumentIndex: number;
};`,
  `type CallFrame = {
  kind: "function" | "group" | "array";
  name?: string;
  argumentIndex: number;
  startTokenIndex?: number;
};`
);
s = s.replace(
  `          ? {
              kind: "function",
              name: previousSignificantToken.text ?? undefined,
              argumentIndex: 0,
            }
          : { kind: "group", argumentIndex: 0 }`,
  `          ? {
              kind: "function",
              name: previousSignificantToken.text ?? undefined,
              argumentIndex: 0,
              startTokenIndex: previousSignificantToken.tokenIndex,
            }
          : { kind: "group", argumentIndex: 0 }`
);
const oldBuild = `function buildActiveHelp(
  tokens: Array<Token>,
  cursorOffset: number,
  localizer?: DocumentationLocalizer
): CompletionResult["activeHelp"] {
  const activeFrame = findActiveCallFrame(tokens, cursorOffset);
  if (!activeFrame?.name) {
    return undefined;
  }

  const func = IfcExpressionFunctions.getFunction(activeFrame.name);
  const documentation = func?.getDocumentation();
  if (!func || !documentation) {
    return undefined;
  }

  const activeArgument = func.getFormalArguments()[activeFrame.argumentIndex];
  const label = func.getSignatureLabel(activeFrame.name);
  const fallback = \`${"${label}: ${documentation.fallback}"}\`;
  return {
    label,
    documentation: localizer ? localizer.t(documentation.key, fallback) : fallback,
    activeParameterIndex: activeFrame.argumentIndex,
    activeParameterLabel: activeArgument
      ? resolveLocalizedText(activeArgument.displayLabel, localizer) ??
        activeArgument.displayLabel?.fallback ??
        activeArgument.name
      : undefined,
    activeParameterDocumentation: activeArgument
      ? resolveLocalizedText(activeArgument.documentation, localizer)
      : undefined,
  };
}`;
const newBuild = [
  `function buildMemberSignatureLabel(`,
  `  definition: BuiltinFunctionDefinition`,
  `): string {`,
  `  return buildSignatureLabel(`,
  `    definition.name,`,
  `    (definition.argumentDocumentation ?? []).map((argument, index) =>`,
  `      argument.label.fallback ?? \`arg\${index}\``,
  `    )`,
  `  );`,
  `}`,
  ``,
  `function buildActiveMemberHelp(`,
  `  parseTree: ParserRuleContext,`,
  `  builtinVariableRegistry: BuiltinVariableRegistry,`,
  `  activeFrame: CallFrame,`,
  `  localizer?: DocumentationLocalizer`,
  `): CompletionResult["activeHelp"] {`,
  `  if (activeFrame.startTokenIndex === undefined || !activeFrame.name) {`,
  `    return undefined;`,
  `  }`,
  ``,
  `  const receiverType = findReceiverTypeForMemberSlot(`,
  `    parseTree,`,
  `    activeFrame.startTokenIndex,`,
  `    builtinVariableRegistry`,
  `  );`,
  `  if (!(receiverType instanceof ContextObjectType)) {`,
  `    return undefined;`,
  `  }`,
  ``,
  `  const memberDefinition = receiverType.getMemberDefinition(activeFrame.name);`,
  `  if (memberDefinition?.kind !== "function" || !memberDefinition.documentation) {`,
  `    return undefined;`,
  `  }`,
  ``,
  `  const label = buildMemberSignatureLabel(memberDefinition);`,
  `  const fallback = \`${"${label}: ${memberDefinition.documentation.fallback}"}\`;`,
  `  const activeArgument = memberDefinition.argumentDocumentation?.[`,
  `    activeFrame.argumentIndex`,
  `  ];`,
  ``,
  `  return {`,
  `    label,`,
  `    documentation: localizer`,
  `      ? localizer.t(memberDefinition.documentation.key, fallback)`,
  `      : fallback,`,
  `    activeParameterIndex: activeFrame.argumentIndex,`,
  `    activeParameterLabel: activeArgument`,
  `      ? resolveLocalizedText(activeArgument.label, localizer) ??`,
  `        activeArgument.label.fallback`,
  `      : undefined,`,
  `    activeParameterDocumentation: activeArgument`,
  `      ? resolveLocalizedText(activeArgument.documentation, localizer)`,
  `      : undefined,`,
  `  };`,
  `}`,
  ``,
  `function buildActiveHelp(`,
  `  parseTree: ParserRuleContext,`,
  `  builtinVariableRegistry: BuiltinVariableRegistry,`,
  `  tokens: Array<Token>,`,
  `  cursorOffset: number,`,
  `  localizer?: DocumentationLocalizer`,
  `): CompletionResult["activeHelp"] {`,
  `  const activeFrame = findActiveCallFrame(tokens, cursorOffset);`,
  `  if (!activeFrame?.name) {`,
  `    return undefined;`,
  `  }`,
  ``,
  `  const memberHelp = buildActiveMemberHelp(`,
  `    parseTree,`,
  `    builtinVariableRegistry,`,
  `    activeFrame,`,
  `    localizer`,
  `  );`,
  `  if (memberHelp) {`,
  `    return memberHelp;`,
  `  }`,
  ``,
  `  const func = IfcExpressionFunctions.getFunction(activeFrame.name);`,
  `  const documentation = func?.getDocumentation();`,
  `  if (!func || !documentation) {`,
  `    return undefined;`,
  `  }`,
  ``,
  `  const activeArgument = func.getFormalArguments()[activeFrame.argumentIndex];`,
  `  const label = func.getSignatureLabel(activeFrame.name);`,
  `  const fallback = \`${"${label}: ${documentation.fallback}"}\`;`,
  `  return {`,
  `    label,`,
  `    documentation: localizer ? localizer.t(documentation.key, fallback) : fallback,`,
  `    activeParameterIndex: activeFrame.argumentIndex,`,
  `    activeParameterLabel: activeArgument`,
  `      ? resolveLocalizedText(activeArgument.displayLabel, localizer) ??`,
  `        activeArgument.displayLabel?.fallback ??`,
  `        activeArgument.name`,
  `      : undefined,`,
  `    activeParameterDocumentation: activeArgument`,
  `      ? resolveLocalizedText(activeArgument.documentation, localizer)`,
  `      : undefined,`,
  `  };`,
  `}`,
].join("\n");
if (!s.includes(oldBuild)) {
  throw new Error("Expected buildActiveHelp block not found");
}
s = s.replace(oldBuild, newBuild);
s = s.replace(
  `    const activeHelp = buildActiveHelp(
      parsed.tokens,
      cursorOffset,
      options.localizer
    );`,
  `    const activeHelp = buildActiveHelp(
      parsed.parseTree,
      builtinVariableRegistry,
      parsed.tokens,
      cursorOffset,
      options.localizer
    );`
);
fs.writeFileSync(path, s);
