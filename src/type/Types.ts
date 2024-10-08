import { ExpressionTypeError } from "../error/ExpressionTypeError.js";
import { SimpleType } from "./SimpleType.js";
import { TypeDisjunction } from "./TypeDisjunction.js";
import { ExprType } from "./ExprType.js";
import { ArrayType } from "./ArrayType.js";
import { TupleType } from "./TupleType.js";

export class Type {
  static readonly ANY = new SimpleType("any");
  static readonly NUMERIC = new SimpleType("numeric");
  static readonly STRING = new SimpleType("string");
  static readonly LOGICAL = new SimpleType("logical");
  static readonly BOOLEAN = new SimpleType("boolean", Type.LOGICAL);
  static readonly IFC_DATE = new SimpleType("ifcDate", Type.STRING);
  static readonly IFC_DATE_TIME = new SimpleType("ifcDateTime", Type.STRING);
  static readonly IFC_TIME = new SimpleType("ifcTime", Type.STRING);
  static readonly IFC_DURATION = new SimpleType("ifcDuration", Type.STRING);
  static readonly IFC_TIME_STAMP = new SimpleType("ifcTimeStamp", Type.NUMERIC);

  static readonly IFC_OBJECT_REF = new SimpleType("ifcObjectRef");
  static readonly IFC_ELEMENT_REF = new SimpleType(
    "ifcElementRef",
    Type.IFC_OBJECT_REF
  );
  static readonly IFC_PROPERTY_REF = new SimpleType(
    "ifcPropertyRef",
    Type.IFC_OBJECT_REF
  );
  static readonly IFC_PROPERTY_SET_REF = new SimpleType(
    "ifcPropertySetRef",
    Type.IFC_OBJECT_REF
  );
  static readonly IFC_TYPE_OBJECT_REF = new SimpleType(
    "ifcTypeObjectRef",
    Type.IFC_OBJECT_REF
  );
  static readonly ARRAY = new SimpleType("array");
}

export class Types {
  public static or(...types: Array<ExprType>) {
    const disjunction = new TypeDisjunction(...types);
    if (disjunction.getTypes().length == 1) {
      return disjunction.getTypes()[0];
    }
    return disjunction;
  }
  public static array(elementType: ExprType): ArrayType {
    return new ArrayType(elementType);
  }
  public static tuple(...types: Array<ExprType>): TupleType {
    return new TupleType(...types);
  }
  public static isNumeric(actualType: ExprType) {
    return this.isType(actualType, Type.NUMERIC);
  }
  public static isBoolean(actualType: ExprType) {
    return this.isType(actualType, Type.BOOLEAN);
  }
  public static isLogical(actualType: ExprType) {
    return this.isType(actualType, Type.LOGICAL);
  }
  public static isString(actualType: ExprType) {
    return this.isType(actualType, Type.STRING);
  }
  public static isIfcDate(actualType: ExprType) {
    return this.isType(actualType, Type.IFC_DATE);
  }
  public static isIfcDateTime(actualType: ExprType) {
    return this.isType(actualType, Type.IFC_DATE_TIME);
  }
  public static isIfcTime(actualType: ExprType) {
    return this.isType(actualType, Type.IFC_TIME);
  }
  public static isIfcDuration(actualType: ExprType) {
    return this.isType(actualType, Type.IFC_DURATION);
  }
  public static isIfcTimeStamp(actualType: ExprType) {
    return this.isType(actualType, Type.IFC_TIME_STAMP);
  }
  public static isType(actualType: ExprType, type: ExprType) {
    return actualType === type;
  }
  public static boolean() {
    return Type.BOOLEAN;
  }
  public static logical() {
    return Type.LOGICAL;
  }
  public static string() {
    return Type.STRING;
  }
  public static ifcDate() {
    return Type.IFC_DATE;
  }
  public static ifcDateTime() {
    return Type.IFC_DATE_TIME;
  }
  public static ifcTime() {
    return Type.IFC_TIME;
  }
  public static ifcDuration() {
    return Type.IFC_DURATION;
  }
  public static ifcTimeStamp() {
    return Type.IFC_TIME_STAMP;
  }
  public static numeric() {
    return Type.NUMERIC;
  }
  public static ifcObjectRef() {
    return Type.IFC_OBJECT_REF;
  }

  public static requireIsAssignableFrom(
    expectedType: ExprType,
    actualType: ExprType,
    exceptionProducer: () => ExpressionTypeError
  ) {
    if (!expectedType.isAssignableFrom(actualType)) {
      throw exceptionProducer();
    }
  }

  /**
   * Requires overlap if actual is a disjunction, assignable from if it is a type
   * @param expectedType
   * @param actualType
   * @param exceptionProducer
   */
  public static requireWeakIsAssignableFrom(
    expectedType: ExprType,
    actualType: ExprType,
    exceptionProducer: () => ExpressionTypeError
  ) {
    if (expectedType.isAssignableFrom(actualType)) {
      return;
    }
    if (actualType instanceof TypeDisjunction) {
      if (expectedType.overlapsWith(actualType)) {
        return;
      }
    }
    if (actualType instanceof TupleType) {
      const weakerType = Types.array(Types.or(...actualType.getTypes()));
      if (expectedType.isAssignableFrom(weakerType)) {
        return;
      }
    }
    throw exceptionProducer();
  }

  static requireTypesOverlap(
    actualType: ExprType,
    actualType2: ExprType,
    exceptionProducer: () => ExpressionTypeError
  ) {
    if (!actualType.overlapsWith(actualType2)) {
      throw exceptionProducer();
    }
  }
}
