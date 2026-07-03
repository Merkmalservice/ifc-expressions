const fs = require("fs");
const path = "src\\autocomplete\\IfcExpressionAutocomplete.ts";
let s = fs.readFileSync(path, "utf8");
const oldSnippet = [
  `  const label = buildMemberSignatureLabel(memberDefinition);`,
  `  const fallback = \`${"${label}: ${memberDefinition.documentation.fallback}"}\`;`,
  `  const activeArgument = memberDefinition.argumentDocumentation?.[`,
].join("\n");
const newSnippet = [
  `  const label = buildMemberSignatureLabel(memberDefinition);`,
  `  const fallback = memberDefinition.documentation.fallback.startsWith(\`${"${label}: "}\`)`,
  `    ? memberDefinition.documentation.fallback`,
  `    : \`${"${label}: ${memberDefinition.documentation.fallback}"}\`;`,
  `  const activeArgument = memberDefinition.argumentDocumentation?.[`,
].join("\n");
if (!s.includes(oldSnippet)) {
  throw new Error("Expected member-help fallback snippet not found");
}
s = s.replace(oldSnippet, newSnippet);
fs.writeFileSync(path, s);
