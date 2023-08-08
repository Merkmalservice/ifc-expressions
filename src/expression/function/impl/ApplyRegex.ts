import { Func } from "../Func.js";
import { FuncArgString } from "../arg/FuncArgString.js";
import { FuncArgSimpleRegex } from "../arg/FuncArgSimpleRegex.js";
import { FuncArgRegex } from "../arg/FuncArgRegex.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean.js";
import { BooleanValue } from "../../../value/BooleanValue.js";

export abstract class ApplyRegex extends Func {
  protected static readonly KEY_INPUT = "input";
  protected static readonly KEY_PATTERN = "pattern";
  protected static readonly KEY_CASE_INSENSITIVE = "caseInsensitive";

  protected readonly requireFullMatch: boolean;

  protected constructor(
    name: string,
    simplePattern: boolean,
    requireFullMatch: boolean
  ) {
    super(name, [
      new FuncArgString(true, ApplyRegex.KEY_INPUT),
      simplePattern
        ? new FuncArgSimpleRegex(true, ApplyRegex.KEY_PATTERN)
        : new FuncArgRegex(true, ApplyRegex.KEY_PATTERN),
      new FuncArgBoolean(
        false,
        ApplyRegex.KEY_CASE_INSENSITIVE,
        BooleanValue.of(false)
      ),
    ]);
    this.requireFullMatch = requireFullMatch;
  }
}
