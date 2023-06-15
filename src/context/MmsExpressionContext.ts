import Decimal from "decimal.js";

export interface MmsExpressionContext {

}

export interface AttributeNameProvider {

}

export interface ObjectReferenceResolver {
     resolvePropRef(): ObjectAccessor;
     resolveElemRef(): ObjectAccessor;
     resolveNameOrGuidRef(nameOrGuid: string): ObjectAccessor;
}

export interface ObjectAccessor {
     getAttribute(name: string): ObjectAccessor | ValueAccessor;
     listAttributes(name: string): Array<AttributeDescriptor>;
}

export interface AttributeDescriptor {
     name(): string;
     type(): string;
}

export interface ValueAccessor {
     value():
}

export type LiteralValue =
     NumericValue
    | StringValue
    | BooleanValue
    | LogicalValue
    | ReferenceValue;

export class Value<T> {
     private readonly value:T;


     constructor(value: T) {
          this.value = value;
     }

     public getValue():T{
          return this.value;
     }
}

export class NumericValue extends Value<Decimal> {

     constructor(value: Decimal) {
          super(value);
     }
}


export class StringValue extends Value<String>{

     constructor(value: String) {
          super(value);
     }
}
export class BooleanValue extends Value<boolean>{

     constructor(value: boolean) {
          super(value);
     }
}
export class LogicalValue extends Value<boolean | "UNKNOWN"> {

     constructor(value: boolean | "UNKNOWN") {
          super(value);
     }
}

export class ReferenceValue = string;

export type Logical = boolean | "UNKNOWN";