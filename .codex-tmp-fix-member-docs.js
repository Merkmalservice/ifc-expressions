const fs = require("fs");
const path = "src\\autocomplete\\IfcExpressionAutocomplete.ts";
let s = fs.readFileSync(path, "utf8");
const old = `function buildMemberDocumentation(
  definition: BuiltinMemberDefinition,
  localizer?: DocumentationLocalizer
): string | undefined {
  if (!definition.documentation) {
    return undefined;
  }

  const fallback =
    definition.kind === "property"
      ? `${definition.name}: ${definition.documentation.fallback}`
      : `${buildSignatureLabel(
          definition.name,
          (definition.argumentDocumentation ?? []).map((argument, index) =>
            argument.label.fallback ?? ` + "`arg${index}`" + `
          )
        )}: ${definition.documentation.fallback}`;

  return localizer
    ? localizer.t(definition.documentation.key, fallback)
    : fallback;
}`;
const replacement = `function buildMemberDocumentationFallback(
  definition: BuiltinMemberDefinition
): string {
  const label =
    definition.kind === "property"
      ? definition.name
      : buildSignatureLabel(
          definition.name,
          (definition.argumentDocumentation ?? []).map((argument, index) =>
            argument.label.fallback ?? ` + "`arg${index}`" + `
          )
        );

  return definition.documentation.fallback.startsWith(`${label}: `)
    ? definition.documentation.fallback
    : `${label}: ${definition.documentation.fallback}`;
}

function buildMemberDocumentation(
  definition: BuiltinMemberDefinition,
  localizer?: DocumentationLocalizer
): string | undefined {
  if (!definition.documentation) {
    return undefined;
  }

  const fallback = buildMemberDocumentationFallback(definition);

  return localizer
    ? localizer.t(definition.documentation.key, fallback)
    : fallback;
}`;
if (!s.includes(old)) {
  throw new Error("Expected buildMemberDocumentation block not found");
}
s = s.replace(old, replacement);
s = s.replace(
  `  const label = buildMemberSignatureLabel(memberDefinition);
  const fallback = `${label}: ${memberDefinition.documentation.fallback}`;`,
  `  const label = buildMemberSignatureLabel(memberDefinition);
  const fallback = buildMemberDocumentationFallback(memberDefinition);`
);
fs.writeFileSync(path, s);
