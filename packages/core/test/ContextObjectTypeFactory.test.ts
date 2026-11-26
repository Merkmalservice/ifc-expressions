import {
  BuiltinVariableRegistry,
  ContextObjectOperator,
  ContextObjectType,
  ContextObjectTypeFactory,
  ContextObjectValue,
  IfcExpression,
  isExprEvalSuccess,
} from "../src/IfcExpression.js";
import { ExprEvalStatus } from "../src/expression/ExprEvalResult.js";
import { Type } from "../src/type/Types.js";

type CodedObject = { code: string };

class CodedObjectFactory implements ContextObjectTypeFactory<CodedObject> {
  constructor(private readonly equalityEnabled = true) {}

  createValue(
    value: CodedObject,
    type: ContextObjectType
  ): ContextObjectValue<CodedObject> {
    return new ContextObjectValue(value, type);
  }

  getBinaryOperator(operator: ContextObjectOperator) {
    if (operator !== ContextObjectOperator.EQUALS || !this.equalityEnabled) {
      return undefined;
    }
    return (left: CodedObject, right: CodedObject) => left.code === right.code;
  }
}

function typeFor(name: string, factory: ContextObjectTypeFactory<any>) {
  return new ContextObjectType(
    name,
    Type.CONTEXT_OBJECT_REF,
    new Map(),
    factory
  );
}

function registryFor(left: ContextObjectType, right: ContextObjectType) {
  return new BuiltinVariableRegistry([
    { name: "$left", type: left },
    { name: "$right", type: right },
  ]);
}

const context = {
  resolveElemRef() {
    throw new Error("not used");
  },
  resolvePropRef() {
    throw new Error("not used");
  },
  resolveBuiltinVariable(name: string) {
    return name === "left" ? { code: "M" } : { code: "M" };
  },
};

describe("ContextObjectTypeFactory", () => {
  it("uses factory identity as nominal type identity", () => {
    const factory = new CodedObjectFactory();
    const first = typeFor("firstName", factory);
    const second = typeFor("secondName", factory);
    const other = typeFor("firstName", new CodedObjectFactory());

    expect(first.isSameTypeAs(second)).toBe(true);
    expect(first.isSameTypeAs(other)).toBe(false);
  });

  it("creates values through the factory and delegates equality", () => {
    const factory = new CodedObjectFactory();
    const type = typeFor("coded", factory);
    const result = IfcExpression.evaluate("$left == $right", context, {
      builtinVariableRegistry: registryFor(type, type),
    });

    expect(isExprEvalSuccess(result)).toBe(true);
    if (!isExprEvalSuccess(result)) {
      throw new Error(result.message);
    }
    expect(result.result.getValue()).toBe(true);
  });

  it("derives inequality from factory equality", () => {
    const factory = new CodedObjectFactory();
    const type = typeFor("coded", factory);
    const result = IfcExpression.evaluate("$left != $right", context, {
      builtinVariableRegistry: registryFor(type, type),
    });

    expect(isExprEvalSuccess(result)).toBe(true);
    if (!isExprEvalSuccess(result)) {
      throw new Error(result.message);
    }
    expect(result.result.getValue()).toBe(false);
  });

  it("rejects equality between different factories at compile time", () => {
    const left = typeFor("leftType", new CodedObjectFactory());
    const right = typeFor("rightType", new CodedObjectFactory());
    const result = IfcExpression.evaluate("$left == $right", context, {
      builtinVariableRegistry: registryFor(left, right),
    });

    expect(isExprEvalSuccess(result)).toBe(false);
    expect(result.status).toBe(ExprEvalStatus.STATIC_TYPE_ERROR);
  });

  it("rejects operators not declared by the factory at compile time", () => {
    const factory = new CodedObjectFactory(false);
    const type = typeFor("coded", factory);
    const result = IfcExpression.evaluate("$left != $right", context, {
      builtinVariableRegistry: registryFor(type, type),
    });

    expect(isExprEvalSuccess(result)).toBe(false);
    expect(result.status).toBe(ExprEvalStatus.STATIC_TYPE_ERROR);
  });
});
