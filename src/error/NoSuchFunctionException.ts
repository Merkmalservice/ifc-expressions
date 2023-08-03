import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class NoSuchFunctionException extends ValidationException {
  readonly functionName: string;
  constructor(functionName: string) {
    super(`Not a IFC Expression Function: ${functionName}`);
    this.functionName = functionName;
  }
}
