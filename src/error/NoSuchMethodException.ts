import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class NoSuchMethodException extends ValidationException {
  readonly methodName: string;
  readonly type: string;

  constructor(methodName: string, type: string, ctx) {
    super(`No method ${methodName} found for type ${type}`, ctx);
    this.methodName = methodName;
    this.type = type;
  }
}
