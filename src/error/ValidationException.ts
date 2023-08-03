import { ParserRuleContext, Token } from "antlr4";

export class ValidationException extends Error {
  readonly message: string;

  constructor(message: string) {
    super("Parse Tree Validation failed: " + message);
    this.message = message;
  }

}
