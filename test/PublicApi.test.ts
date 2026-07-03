import {
  ContextObjectType,
  IfcExpressionAutocomplete,
} from "../src/IfcExpression.js";

describe("public API", () => {
  it("exports ContextObjectType from the package root", () => {
    expect(ContextObjectType).toBeDefined();
  });

  it("exports IfcExpressionAutocomplete from the package root", () => {
    expect(IfcExpressionAutocomplete).toBeDefined();
  });
});
