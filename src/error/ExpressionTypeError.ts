import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class ExpressionTypeError extends ValidationException {


  constructor(message: string, ctx:ParserRuleContext) {
    super(`Type error: ${message}`, ctx);
  }
}
