import {IfcPropertySetAccessor} from "../src/context/IfcPropertySetAccessor";
import {IfcPropertyAccessor} from "../src/context/IfcPropertyAccessor";
import {ExpressionValue} from "../src/value/ExpressionValue";
import {StringValue} from "../src/value/StringValue";
import {NumericValue} from "../src/value/NumericValue";
import {BooleanValue} from "../src/value/BooleanValue";
import {IfcElementAccessor} from "../src/context/IfcElementAccessor";
import {IfcTypeObjectAccessor} from "../src/context/IfcTypeObjectAccessor";

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
            }
            return undefined;
        }

        getName(): string {
            return "PSet_Betonbau";
        }

        listIfcPropertyNames(): Array<string> {
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

        getIfcTypeObjectAccessor(): IfcTypeObjectAccessor | undefined {
            return ctxSimple.Decke;
        }

        listIfcPropertyNames(): Array<string> {
            return ["Betonguete", "Bewehrungsgrad", "Sichtbeton"];
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
            }
        }

        getIfcPropertySetAccessor(name: string): IfcPropertySetAccessor | undefined {
            if (name === 'PSet_Betonbau') {
                return ctxSimple.psetDeckeBetonbau;
            }
            return undefined;
        }

        getName(): string {
            return "Geschoßdecke";
        }

        listIfcPropertyNames(): Array<string> {
            return ["Betonguete", "Bewehrungsgrad", "Sichtbeton"];
        }

        listIfcPropertySetNames(): Array<string> {
            return ["PSet_Betonbau"];
        }

    }),

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
            }
            return undefined;
        }

        getName(): string {
            return "PSet_Betonbau";
        }

        listIfcPropertyNames(): Array<string> {
            return ["Betonguete", "Bewehrungsgrad", "Sichtbeton"];
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
            return new BooleanValue(false);
        }
    })(),

};