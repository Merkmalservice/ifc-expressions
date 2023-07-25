import { IfcExpression } from "../src/IfcExpression";
import Decimal from "decimal.js";
import { IfcExpressionContext } from "../src/context/IfcExpressionContext";
import { NumericValue } from "../src/value/NumericValue";
import { LiteralValueAnyArity } from "../src/value/LiteralValueAnyArity";
import { StringValue } from "../src/value/StringValue";
import { BooleanValue } from "../src/value/BooleanValue";
import { ObjectAccessor } from "../src/context/ObjectAccessor";
import { IfcElementAccessor } from "../src/context/IfcElementAccessor";
import { IfcPropertyAccessor } from "../src/context/IfcPropertyAccessor";
import { IfcPropertySetAccessor } from "../src/context/IfcPropertySetAccessor";
import { IfcTypeObjectAccessor } from "../src/context/IfcTypeObjectAccessor";
import {
  ExprEvalRefChainErrorObj,
  ExprEvalStatus,
  ExprEvalSuccess,
  ExprEvalSuccessObj,
} from "../src/expression/ExprEvalResult";
import { ExprKind } from "../src/expression/ExprKind";

const ctxSimple: any = {
  psetBetonbau: new (class extends IfcPropertySetAccessor {
    getDescription(): string {
      return "Properties describing the concrete";
    }

    getGuid(): string {
      return "1dkoXLAXj0B8O8L2CFQKAH";
    }

    protected getIfcPropertyAccessor(
      name: string
    ): IfcPropertyAccessor | undefined {
      switch (name) {
        case "Betonguete":
          return ctxSimple.propBetonguete;
        case "Bewehrungsgrad":
          return ctxSimple.propBewehrungsgrad;
        case "Sichtbeton":
          return ctxSimple.propSichtbeton;
      }
      return undefined;
    }

    getName(): string {
      return "PSet_Betonbau";
    }

    protected listIfcProperties(): Array<string> {
      return ["Betonguete", "Bewehrungsgrad", "Sichtbeton"];
    }
  })(),
  propBetonguete: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "The quality of concrete";
    }

    getName(): string {
      return "Betonguete";
    }

    protected getPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    protected getValue(): LiteralValueAnyArity {
      return new StringValue("C25/30");
    }
  })(),

  propBewehrungsgrad: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "The reinforcement ratio of concrete";
    }

    getName(): string {
      return "Bewehrungsgrad";
    }

    protected getPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    protected getValue(): LiteralValueAnyArity {
      return new NumericValue(120);
    }
  })(),

  propSichtbeton: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "Indicates whether the concrete is left uncovered";
    }

    getName(): string {
      return "Sichtbeton";
    }

    protected getPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    protected getValue(): LiteralValueAnyArity {
      return new BooleanValue(true);
    }
  })(),

  slabGeschossdecke: new (class extends IfcElementAccessor {
    getDescription(): string {
      return "An IFC element for testing";
    }

    getGuid(): string {
      return "25lDy1lKL0189KIclXWspu";
    }

    getIfcClass(): string {
      return "IfcSlab";
    }

    getIfcPropertyAccessor(
      propertyName: string
    ): IfcPropertyAccessor | undefined {
      switch (propertyName) {
        case "Betonguete":
          return ctxSimple.propBetonguete;
        case "Bewehrungsgrad":
          return ctxSimple.propBewehrungsgrad;
        case "Sichtbeton":
          return ctxSimple.propSichtbeton;
      }
    }

    getIfcPropertySetAccessor(
      name: string
    ): IfcPropertySetAccessor | undefined {
      if (name === "PSet_Betonbau") {
        return ctxSimple.psetBetonbau;
      }
      return undefined;
    }

    getName(): string {
      return "Geschossdecke:DE_STB - 20,0 cm:2309081";
    }

    getTypeObjectAccessor(): IfcTypeObjectAccessor | undefined {
      return undefined;
    }

    listIfcProperties(): Array<string> {
      return ["Betonguete", "Bewehrungsgrad", "Sichtbeton"];
    }

    listIfcPropertySets(): Array<string> {
      return ["PSet_Betonbau"];
    }
  })(),

  resolveElemRef: () => ctxSimple.slabGeschossdecke,

  resolvePropRef: () => ctxSimple.propBewehrungsgrad,
};

describe.each([
  ["1", new Decimal("1")],
  ["1.5", new Decimal("1.5")],
  ["1+1", new Decimal("2")],
  ["2*3", new Decimal("6")],
  ["6/2", new Decimal("3")],
  ["6-2", new Decimal("4")],
  ["1/5", new Decimal("0.2")],
  ["2*2+1", new Decimal("5")],
  ["1+2*2", new Decimal("5")],
  ["(1+2)*2", new Decimal("6")],
  ["(1+(2)*2)", new Decimal("5")],
  ["[1,2,3]", [new NumericValue(1), new NumericValue(2), new NumericValue(3)]],
  ["ROUND(1.1,0)", new Decimal("1")],
  ["ROUND(0.5,0)", new Decimal("1")],
  ["ROUND(-0.5,0)", new Decimal("-1")],
  ["ROUND(-0.5,1)", new Decimal("-0.5")],
  ["ROUND(-0.15,1)", new Decimal("-0.2")],
  ["ROUND(-0.15,0)", new Decimal("-0")],
  ["ROUND(1.1,1)", new Decimal("1.1")],
  ["ROUND(1.11,1)", new Decimal("1.1")],
  ["ROUND(1.149,1)", new Decimal("1.1")],
  ["ROUND(1.15,1)", new Decimal("1.2")],
  ['MAP("rot", [["rot", "grün", "blau"], ["red","green", "blue"]])', "red"],
  ['MAP("grün", [["rot", "grün", "blau"], ["red","green", "blue"]])', "green"],
  ['MAP("blau", [["rot", "grün", "blau"], ["red","green", "blue"]])', "blue"],
  ["MAP(1, [[1,2,3], [10,20,30]])", new Decimal(10)],
  [
    'MAP("blau", [["rot", "grün", "b" + "l" + "a" + "u"], ["red","green", "blue"]])',
    "blue",
  ],
  [
    'MAP("yellow", [["rot", "grün", "blau"], ["red","green", "blue"]], "not found")',
    "not found",
  ],
  /*['MAP(ENUM_IRI(prop@value), [["urn:uuid:123123123"],["urn:uuid:789987789"]], "not found")', "not found"],
  ['MAP(prop@value, LOAD_MATRIX("STRABAG_TO_ASFINAG_STATES"), "not found")', "not found"],*/
])("ifcExpression (numeric, no context)", (input: string, result: any) => {
  it(`evaluate("${input}") = ${result}`, () => {
    const actualResult = IfcExpression.evaluate(
      input,
      {} as unknown as IfcExpressionContext
    );
    expect(
      (actualResult as ExprEvalSuccess<any>).result.getValue()
    ).toStrictEqual(result);
  });
});

describe.each([
  [
    "prop@value",
    new Decimal(1),
    {
      resolvePropRef: () =>
        ({
          getAttribute: (s) => new NumericValue(new Decimal(1)),
        } as unknown as ObjectAccessor),
    } as unknown as IfcExpressionContext,
  ],
  [
    "elem.myProp1@value",
    new Decimal(1),
    {
      resolveElemRef: () =>
        ({
          getNestedObjectAccessor: (s) =>
            ({
              getAttribute: (s) => new NumericValue(new Decimal(1)),
            } as unknown as ObjectAccessor),
        } as unknown as ObjectAccessor),
    } as unknown as IfcExpressionContext,
  ],
  [
    "(elem.myProp1@value + 1) * 3",
    new Decimal(6),
    {
      resolveElemRef: () =>
        ({
          getNestedObjectAccessor: (s) =>
            ({
              getAttribute: (s) => new NumericValue(new Decimal(1)),
            } as unknown as ObjectAccessor),
        } as unknown as ObjectAccessor),
    } as unknown as IfcExpressionContext,
  ],
])(
  "ifcExpression (with context)",
  (input: string, result: any, context: any) => {
    it(`evaluate("${input}", ctx) = ${result}`, () => {
      const actualResult = IfcExpression.evaluate(input, context);
      expect(
        (actualResult as ExprEvalSuccess<NumericValue>).result.getValue()
      ).toStrictEqual(result);
    });
  }
);

describe.each([
  ["prop@value", new ExprEvalSuccessObj(NumericValue.of(120)), ctxSimple],
  ["prop@value / 12", new ExprEvalSuccessObj(NumericValue.of(10)), ctxSimple],
  [
    "prop@name",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    "elem@name",
    new ExprEvalSuccessObj(
      StringValue.of("Geschossdecke:DE_STB - 20,0 cm:2309081")
    ),
    ctxSimple,
  ],
  [
    "elem.Bewehrungsgrad@value",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    "elem.Bewehrungsgrad@name",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    'elem.Bewehrungsgrad@name + " " + prop@value',
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad 120")),
    ctxSimple,
  ],
  [
    'prop.pset@name + ": " + elem.Bewehrungsgrad@name + " " + prop@value',
    new ExprEvalSuccessObj(StringValue.of("PSet_Betonbau: Bewehrungsgrad 120")),
    ctxSimple,
  ],
  [
    "elem.Sichtbeton@value",
    new ExprEvalSuccessObj(BooleanValue.of(true)),
    ctxSimple,
  ],
  [
    "elem@ifcClass",
    new ExprEvalSuccessObj(StringValue.of("IfcSlab")),
    ctxSimple,
  ],
  [
    "elem.dontFindThisProperty@value",
    ExprEvalRefChainErrorObj.bubbleUp(
      new ExprEvalRefChainErrorObj(
        ExprKind.REF_NESTED_OBJECT_CHAIN,
        ExprEvalStatus.REFERENCE_ERROR,
        "dontFindThisProperty",
        "No such nested object: 'dontFindThisProperty'"
      ),
      "REF_ELEMENT"
    ),
    ctxSimple,
  ],
  [
    "elem.PSet_Betonbau.dontFindThisProperty@value",
    ExprEvalRefChainErrorObj.bubbleUp(
      ExprEvalRefChainErrorObj.bubbleUp(
        new ExprEvalRefChainErrorObj(
          ExprKind.REF_NESTED_OBJECT_CHAIN,
          ExprEvalStatus.REFERENCE_ERROR,
          "dontFindThisProperty",
          "No such nested object: 'dontFindThisProperty'"
        ),
        "PSet_Betonbau"
      ),
      "REF_ELEMENT"
    ),
    ctxSimple,
  ],
  [
    "prop.pset.dontFindThisProperty@value",
    ExprEvalRefChainErrorObj.bubbleUp(
      ExprEvalRefChainErrorObj.bubbleUp(
        new ExprEvalRefChainErrorObj(
          ExprKind.REF_NESTED_OBJECT_CHAIN,
          ExprEvalStatus.REFERENCE_ERROR,
          "dontFindThisProperty",
          "No such nested object: 'dontFindThisProperty'"
        ),
        "pset"
      ),
      "REF_PROPERTY"
    ),
    ctxSimple,
  ],
  [
    "elem.PSet_Betonbau.Bewehrungsgrad@value",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
])(
  "ifcExpression (with 'simple' context)",
  (input: string, result: any, context: any) => {
    it(`evaluate("${input}", ctx) = ${result}`, () => {
      const actualResult = IfcExpression.evaluate(input, context);
      expect(actualResult).toStrictEqual(result);
    });
  }
);

describe("ifcExpression", () => {
  it(".evaluate(ctx) throws SyntaxErrorException", () => {
    expect(() =>
      IfcExpression.evaluate("1+", {} as unknown as IfcExpressionContext)
    ).toThrow();
  });
  it(".parse() does not throw SyntaxErrorException", () => {
    expect(() => IfcExpression.parse("1+")).not.toThrow();
  });
});
