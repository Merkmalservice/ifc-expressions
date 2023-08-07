import {ParserRuleContext} from "antlr4";
import {ValidationException} from "./ValidationException.js";

export class NoSuchFunctionException extends ValidationException {
  readonly functionName: string;
  constructor(functionName: string, ctx: ParserRuleContext) {
    super(`Not a IFC Expression Function: ${functionName}`, ctx);
    this.functionName = functionName;
  }
}
