import {
  ContextObjectType,
  IfcExpression,
  IfcExpressionAutocomplete,
} from "../src/IfcExpression.js";

describe("public API", () => {
  it("exports ContextObjectType from the package root", () => {
    expect(ContextObjectType).toBeDefined();
  });

  it("exports IfcExpressionAutocomplete from the package root", () => {
    expect(IfcExpressionAutocomplete).toBeDefined();
  });

  it("exports IfcExpression.unwrapValue through the package root", () => {
    expect(typeof IfcExpression.unwrapValue).toBe("function");
  });
});
