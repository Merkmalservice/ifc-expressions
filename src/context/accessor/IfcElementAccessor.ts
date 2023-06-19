import {ObjectAccessor} from "./ObjectAccessor";
import {IfcRootObjectAccessor} from "./IfcRootObjectAccessor";
import {IfcTypeObjectAccessor} from "./IfcTypeObjectAccessor";
import {IfcPropertyAccessor} from "./IfcPropertyAccessor";
import {LiteralValueAnyArity} from "../value/LiteralValueAnyArity";
import {StringValue} from "../value/StringValue";
import {notNullish} from "../../utils";
import {IfcPropertySetAccessor} from "./IfcPropertySetAccessor";

export abstract class IfcElementAccessor extends IfcRootObjectAccessor {
    getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
        if (name === 'type'){
            return this.getTypeObjectAccessor();
        }
        let val = this.getIfcPropertyAccessor(name);
        if (notNullish(val)){
            return val;
        }
        return this.getIfcPropertySetAccessor(name);
    }

    getAttribute(name: string): LiteralValueAnyArity | undefined {
        switch (name) {
            case 'ifcClass' : new StringValue(this.getIfcClass());
            default: return super.getAttribute(name);
        }
        return super.getAttribute(name);
    }

    abstract getIfcClass(): string;

    listNestedObjects(): Array<string> {
        return ['type', ...this.listIfcProperties(), ... this.listIfcPropertySets()];
    }

    listAttributes(): Array<string> {
        return ['ifcClass', ...super.listAttributes()];
    }

    abstract listIfcProperties(): Array<string>;

    abstract listIfcPropertySets(): Array<string>;

    abstract getTypeObjectAccessor(): IfcTypeObjectAccessor | undefined;
    abstract getIfcPropertyAccessor(propertyName: string): IfcPropertyAccessor | undefined;

    abstract getIfcPropertySetAccessor(name: string): IfcPropertySetAccessor | undefined;
}
