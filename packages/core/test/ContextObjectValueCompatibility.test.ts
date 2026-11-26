import { Type } from "../src/type/Types.js";
import { ContextObjectValue } from "../src/value/ContextObjectValue.js";

describe("legacy ContextObjectValue equality", () => {
  it("compares wrapped context objects by reference identity", () => {
    const sharedObject = { id: "shared" };

    const first = new ContextObjectValue(
      sharedObject,
      Type.CONTEXT_OBJECT_REF
    );
    const sameReference = new ContextObjectValue(
      sharedObject,
      Type.CONTEXT_OBJECT_REF
    );
    const structurallyEqual = new ContextObjectValue(
      { id: "shared" },
      Type.CONTEXT_OBJECT_REF
    );

    expect(first.equals(sameReference)).toBe(true);
    expect(first.equals(structurallyEqual)).toBe(false);
  });
});
