import {PrimitiveValueType} from "./PrimitiveValueType";

export class Value<T extends PrimitiveValueType> {
    private readonly value: T;


    constructor(value: T) {
        this.value = value;
    }

    public getValue(): T {
        return this.value;
    }
}