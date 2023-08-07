import {ExpressionTypeError} from "../error/ExpressionTypeError";
import {UnaryMinusExpr} from "../expression/numeric/UnaryMinusExpr";

export enum Type {
    NUMERIC = "numeric",
    STRING = "string",
    BOOLEAN = "boolean",
    ANY= "any",
    UNKNOWN = "unknown",
    IFC_OBJECT_REF="ifcObjectRef",
    ARRAY = "array"
}

export class Types {
    public static isNumeric(actualType: Type){
        return this.isType(actualType, Type.NUMERIC);
    }
    public static isBoolean(actualType: Type){
        return this.isType(actualType, Type.BOOLEAN);
    }
    public static isString(actualType: Type){
        return this.isType(actualType, Type.STRING);
    }
    public static isType(actualType: Type, type: Type){
        return actualType === type;
    }
    public static boolean(){
        return Type.BOOLEAN;
    }
    public static unknown(){
        return Type.UNKNOWN;
    }
    public static string(){
        return Type.STRING;
    }
    public static numeric(){
        return Type.NUMERIC;
    }
    public static ifcObjectRef(){
        return Type.IFC_OBJECT_REF;
    }

    public static requireExactTypeOrUnknown(actualType: Type, type: Type, exceptionProducer: () => ExpressionTypeError) {
        if (!(this.isTypeOrUnknown(actualType, type))){
            throw exceptionProducer();
        }
    }

    public static isTypeOrUnknown(actualType: Type, type: Type) {
        return this.isType(type, Type.ANY) || this.isType(actualType, type) || this.isType(actualType, Type.UNKNOWN);
    }

    static requireTypesOverlap(actualType: Type, actualType2: Type, exceptionProducer: () => ExpressionTypeError) {
        if (!this.isSameType(actualType, actualType2) && ! this.isType(actualType, Type.UNKNOWN) && ! this.isType(actualType2, Type.UNKNOWN)){
            throw exceptionProducer();
        }
    }

    static array() {
        return Type.ARRAY;
    }

    private static isSameType(actualType: Type, actualType2: Type) {
        return actualType === actualType2;
    }
}