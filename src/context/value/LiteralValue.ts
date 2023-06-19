import {NumericValue} from "./NumericValue";
import {StringValue} from "./StringValue";
import {BooleanValue} from "./BooleanValue";
import {LogicalValue} from "./LogicalValue";
import {ReferenceValue} from "./ReferenceValue";

export type LiteralValue =
    NumericValue
    | StringValue
    | BooleanValue
    | LogicalValue
    | ReferenceValue;