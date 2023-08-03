import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class InvalidSyntaxException extends ValidationException {
  private offendingInput: string;

  constructor(offendingInput: string, ctx) {
    super("Invalid Syntax: " + offendingInput);
    this.offendingInput = offendingInput;
  }
}
