import {Value} from "./Value";

export class ReferenceValue extends Value<string> {

    constructor(value: string) {
        super(value);
    }

    public static of(value: string): ReferenceValue {
        return new ReferenceValue(value);
    }
}