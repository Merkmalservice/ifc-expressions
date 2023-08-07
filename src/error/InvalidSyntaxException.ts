import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class InvalidSyntaxException extends ValidationException {
  readonly offendingInput: string;
  constructor(offendingInput: string, ctx: ParserRuleContext) {
    super(`Invalid syntax: ${offendingInput}`, ctx);
    this.offendingInput = offendingInput;
  }
}
