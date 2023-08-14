import { IfcPropertySetAccessor } from "../src/context/IfcPropertySetAccessor.js";
import { IfcPropertyAccessor } from "../src/context/IfcPropertyAccessor.js";
import { ExpressionValue } from "../src/value/ExpressionValue.js";
import { StringValue } from "../src/value/StringValue.js";
import { NumericValue } from "../src/value/NumericValue.js";
import { BooleanValue } from "../src/value/BooleanValue.js";
import { IfcElementAccessor } from "../src/context/IfcElementAccessor.js";
import { IfcTypeObjectAccessor } from "../src/context/IfcTypeObjectAccessor.js";
import { LogicalValue } from "../src/value/LogicalValue";

export const ctxSimple: any = {
  psetBetonbau: new (class extends IfcPropertySetAccessor {
    getDescription(): string {
      return "$propertyerties describing the concrete";
    }

    getGuid(): string {
      return "1dkoXLAXj0B8O8L2CFQKAH";
    }

    getIfcPropertyAccessor(name: string): IfcPropertyAccessor | undefined {
      switch (name) {
        case "Betonguete":
          return ctxSimple.propBetonguete;
        case "Bewehrungsgrad":
          return ctxSimple.propBewehrungsgrad;
        case "Sichtbeton":
          return ctxSimple.propSichtbeton;
        case "BelastungstestBestanden":
          return ctxSimple.propBelastungstestBestanden;
      }
      return undefined;
    }

    getName(): string {
      return "PSet_Betonbau";
    }

    listIfcPropertyNames(): Array<string> {
      return [
        "Betonguete",
        "Bewehrungsgrad",
        "Sichtbeton",
        "BelastungstestBestanden",
      ];
    }
  })(),
  propBetonguete: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "The quality of concrete";
    }

    getName(): string {
      return "Betonguete";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    getValue(): ExpressionValue {
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

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    getValue(): ExpressionValue {
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

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    getValue(): ExpressionValue {
      return BooleanValue.of(true);
    }
  })(),

  propBelastungstestBestanden: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "Indicates whether the load test was passed successfully";
    }

    getName(): string {
      return "BelastungstestBestanden";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetBetonbau;
    }

    getValue(): ExpressionValue {
      return LogicalValue.of(true);
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
        case "BelastungstestBestanden":
          return ctxSimple.propBelastungstestBestanden;
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

    getIfcTypeObjectAccessor(): IfcTypeObjectAccessor | undefined {
      return ctxSimple.Decke;
    }

    listIfcPropertyNames(): Array<string> {
      return [
        "Betonguete",
        "Bewehrungsgrad",
        "Sichtbeton",
        "BelastungstestBestanden",
      ];
    }

    listIfcPropertySetNames(): Array<string> {
      return ["PSet_Betonbau"];
    }
  })(),

  resolveElemRef: () => ctxSimple.slabGeschossdecke,

  resolvePropRef: () => ctxSimple.propBewehrungsgrad,

  Decke: new (class extends IfcTypeObjectAccessor {
    getDescription(): string {
      return "Decke eines Geschosses";
    }

    getGuid(): string {
      return "abc234efg";
    }

    getIfcPropertyAccessor(name: string): IfcPropertyAccessor | undefined {
      switch (name) {
        case "Betonguete":
          return ctxSimple.propDeckeBetonguete;
        case "Bewehrungsgrad":
          return ctxSimple.propDeckeBewehrungsgrad;
        case "Sichtbeton":
          return ctxSimple.propDeckeSichtbeton;
        case "BelastungstestBestanden":
          return ctxSimple.propDeckeBelastungstestBestanden;
      }
    }

    getIfcPropertySetAccessor(
      name: string
    ): IfcPropertySetAccessor | undefined {
      if (name === "PSet_Betonbau") {
        return ctxSimple.psetDeckeBetonbau;
      }
      return undefined;
    }

    getName(): string {
      return "Geschoßdecke";
    }

    listIfcPropertyNames(): Array<string> {
      return [
        "Betonguete",
        "Bewehrungsgrad",
        "Sichtbeton",
        "BelastungstestBestanden",
      ];
    }

    listIfcPropertySetNames(): Array<string> {
      return ["PSet_Betonbau"];
    }
  })(),

  psetDeckeBetonbau: new (class extends IfcPropertySetAccessor {
    getDescription(): string {
      return "Properties describing the concrete";
    }

    getGuid(): string {
      return "wern23p2342398732";
    }

    getIfcPropertyAccessor(name: string): IfcPropertyAccessor | undefined {
      switch (name) {
        case "Betonguete":
          return ctxSimple.propDeckeBetonguete;
        case "Bewehrungsgrad":
          return ctxSimple.propDeckeBewehrungsgrad;
        case "Sichtbeton":
          return ctxSimple.propDeckeSichtbeton;
        case "BelastungstestBestanden":
          return ctxSimple.propDeckeBelastungstestBestanden;
      }
      return undefined;
    }

    getName(): string {
      return "PSet_Betonbau";
    }

    listIfcPropertyNames(): Array<string> {
      return [
        "Betonguete",
        "Bewehrungsgrad",
        "Sichtbeton",
        "BelastungstestBestanden",
      ];
    }
  })(),
  propDeckeBetonguete: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "The quality of concrete";
    }

    getName(): string {
      return "Betonguete";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetDeckeBetonbau;
    }

    getValue(): ExpressionValue {
      return new StringValue("C20/25");
    }
  })(),

  propDeckeBewehrungsgrad: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "The reinforcement ratio of concrete";
    }

    getName(): string {
      return "Bewehrungsgrad";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetDeckeBetonbau;
    }

    getValue(): ExpressionValue {
      return new NumericValue(100);
    }
  })(),

  propDeckeSichtbeton: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "Indicates whether the concrete is left uncovered";
    }

    getName(): string {
      return "Sichtbeton";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetDeckeBetonbau;
    }

    getValue(): ExpressionValue {
      return BooleanValue.of(false);
    }
  })(),

  propDeckeBelastungstestBestanden: new (class extends IfcPropertyAccessor {
    getDescription(): string {
      return "Indicates whether the load test was passed successfully";
    }

    getName(): string {
      return "BelastungstestBestanden";
    }

    getIfcPropertySetAccessor(): IfcPropertySetAccessor {
      return ctxSimple.psetDeckeBetonbau;
    }

    getValue(): ExpressionValue {
      return LogicalValue.unknown();
    }
  })(),
};
