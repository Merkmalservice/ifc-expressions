const fs = require("fs");
const path = "test\\IfcExpressionAutocomplete.test.ts";
let s = fs.readFileSync(path, "utf8");
if (!s.includes("localized builtin function docs for $functionName")) {
  s = s.replace(
    '  it("keeps builtin root metadata plain", () => {',
    '  describe.each(builtinFunctionCoverageCases)(\n' +
      '    "localized builtin function docs for $functionName",\n' +
      '    ({ functionName, text }) => {\n' +
      '      it("includes localized documentation for the builtin suggestion", () => {\n' +
      '        const matchingItem = complete(text, { localizer }).items.find(\n' +
      '          (item) => item.label === functionName\n' +
      '        );\n\n' +
      '        expect(matchingItem).toEqual(\n' +
      '          expect.objectContaining({\n' +
      '            kind: "builtinFunction",\n' +
      '            documentation: expect.stringContaining("[function."),\n' +
      '          })\n' +
      '        );\n' +
      '      });\n' +
      '    }\n' +
      '  );\n\n' +
      '  it("keeps builtin root metadata plain", () => {'
  );
}
if (!s.includes("incomplete custom member calls")) {
  s = s.replace(
    '  it("keeps builtin member metadata typed", () => {',
    '  it("returns localized active argument help for incomplete custom member calls", () => {\n' +
      '    const result = complete("$query.matches(", {\n' +
      '      localizer,\n' +
      '    });\n\n' +
      '    expect(result.items).toEqual([]);\n' +
      '    expect(result.activeHelp).toEqual({\n' +
      '      label: "matches(pattern)",\n' +
      '      documentation:\n' +
      '        "[builtin.$query.matches.summary] matches(pattern): whether the query matches the provided pattern",\n' +
      '      activeParameterIndex: 0,\n' +
      '      activeParameterLabel:\n' +
      '        "[builtin.$query.matches.arg.pattern.label] pattern",\n' +
      '      activeParameterDocumentation:\n' +
      '        "[builtin.$query.matches.arg.pattern.summary] The pattern to test against the query",\n' +
      '    });\n' +
      '  });\n\n' +
      '  it("returns localized active argument help for incomplete standard member calls", () => {\n' +
      '    const result = complete("$element.property(", {\n' +
      '      localizer,\n' +
      '    });\n\n' +
      '    expect(result.items).toEqual([]);\n' +
      '    expect(result.activeHelp).toEqual({\n' +
      '      label: "property(name)",\n' +
      '      documentation:\n' +
      '        "[builtin.$element.property.summary] property(name): property of the current IFC element by name",\n' +
      '      activeParameterIndex: 0,\n' +
      '      activeParameterLabel:\n' +
      '        "[builtin.$element.property.arg.name.label] name",\n' +
      '      activeParameterDocumentation:\n' +
      '        "[builtin.$element.property.arg.name.summary] The name of the property to resolve",\n' +
      '    });\n' +
      '  });\n\n' +
      '  describe.each([\n' +
      '    {\n' +
      '      text: "$element.",\n' +
      '      labels: elementMemberLabels,\n' +
      '    },\n' +
      '    {\n' +
      '      text: "$property.",\n' +
      '      labels: propertyMemberLabels,\n' +
      '    },\n' +
      '    {\n' +
      '      text: "$element.propertySet(\'PSet_Betonbau\').",\n' +
      '      labels: propertySetMemberLabels,\n' +
      '    },\n' +
      '    {\n' +
      '      text: "$element.type().",\n' +
      '      labels: typeObjectMemberLabels,\n' +
      '    },\n' +
      '  ])("localized standard member docs for $text", ({ text, labels }) => {\n' +
      '    it("includes documentation on every suggested standard member", () => {\n' +
      '      const items = complete(text, { localizer }).items;\n\n' +
      '      expect(items.map((item) => item.label)).toEqual(labels);\n' +
      '      expect(items.every((item) => item.documentation?.startsWith("[builtin."))).toBe(\n' +
      '        true\n' +
      '      );\n' +
      '    });\n' +
      '  });\n\n' +
      '  it("keeps builtin member metadata typed", () => {'
  );
}
fs.writeFileSync(path, s);
