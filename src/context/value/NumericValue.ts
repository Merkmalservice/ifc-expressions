import {Value} from "./Value";
import Decimal from "decimal.js";

export class NumericValue extends Value<Decimal> {
    constructor(value: Decimal) {
        super(value);
    }

    public static of(value: Decimal): NumericValue {
        return new NumericValue(value);
    }
}