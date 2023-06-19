import {ObjectAccessor} from "./ObjectAccessor";
import {IfcRootObjectAccessor} from "./IfcRootObjectAccessor";
import {IfcPropertySetAccessor} from "./IfcPropertySetAccessor";
import {notNullish} from "../../utils";
import {IfcPropertyAccessor} from "./IfcPropertyAccessor";

export abstract class IfcTypeObjectAccessor extends IfcRootObjectAccessor{
    getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
        let val = this.getIfcPropertyAccessor(name);
        if (notNullish(val)){
            return val;
        }
        return this.getIfcPropertySetAccessor(name);
    }

    listNestedObjects(): Array<string> {
        return [...this.listIfcPropertyNames(), ...this.listIfcPropertySetNames()];
    }

    listAttributes(): Array<string> {
        return [...super.listAttributes()];
    }

    protected abstract getIfcPropertySetAccessor(name:string): IfcPropertySetAccessor | undefined;

    protected abstract getIfcPropertyAccessor(name:string): IfcPropertyAccessor | undefined;

    abstract listIfcPropertySetNames(): Array<string>;
    abstract listIfcPropertyNames(): Array<string>;

}