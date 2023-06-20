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
      return ctxSimple().psetBetonbau;
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
      return ["PSet_Betonbau", "PSet_5D"];
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
])("ifcExpression (numeric, no context)", (input: string, result: any) => {
  it(`evaluate("${input}") = ${result}`, () => {
    const actualResult = IfcExpression.evaluate(
      input,
      {} as unknown as IfcExpressionContext
    );
    expect((actualResult as NumericValue).getValue()).toStrictEqual(result);
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
      expect((actualResult as NumericValue).getValue()).toStrictEqual(result);
    });
  }
);

describe.each([
  ["prop@value", new Decimal(120), ctxSimple],
  ["prop@value / 12", new Decimal(10), ctxSimple],
  ["prop@name", "Bewehrungsgrad", ctxSimple],
  ["elem@name", "Geschossdecke:DE_STB - 20,0 cm:2309081", ctxSimple],
  ["elem.Bewehrungsgrad@value", new Decimal(120), ctxSimple],
  ["elem.Bewehrungsgrad@name", "Bewehrungsgrad", ctxSimple],
  [
    'elem.Bewehrungsgrad@name + " " + prop@value',
    "Bewehrungsgrad 120",
    ctxSimple,
  ],
  [
    'prop.pset@name + ": " + elem.Bewehrungsgrad@name + " " + prop@value',
    "PSet_Betonbau: Bewehrungsgrad 120",
    ctxSimple,
  ],
  ["elem.Sichtbeton@value", true, ctxSimple],
  ["elem@ifcClass", "IfcSlab", ctxSimple],
])(
  "ifcExpression (with 'simple' context)",
  (input: string, result: any, context: any) => {
    it(`evaluate("${input}", ctx) = ${result}`, () => {
      const actualResult = IfcExpression.evaluate(input, context);
      expect((actualResult as NumericValue).getValue()).toStrictEqual(result);
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
