import IfcExpressionListener from "./gen/parser/IfcExpressionListener.js";
import {
  FunctionCallContext,
  NumUnaryMultipleMinusContext,
} from "./gen/parser/IfcExpressionParser.js";
import { IfcExpressionFunctions } from "./expression/function/IfcExpressionFunctions.js";
import { NoSuchFunctionException } from "./error/NoSuchFunctionException.js";
import { InvalidSyntaxException } from "./error/InvalidSyntaxException.js";

export class IfcExpressionValidationListener extends IfcExpressionListener {
  constructor() {
    super();
  }

  enterFunctionCall: (ctx: FunctionCallContext) => void = (ctx) => {
    if (!IfcExpressionFunctions.isBuiltinFunction(ctx.IDENTIFIER().getText())) {
      throw new NoSuchFunctionException(ctx.IDENTIFIER().getText());
    }
  };

  enterNumUnaryMultipleMinus: (ctx: NumUnaryMultipleMinusContext) => void = (
    ctx
  ) => {
    throw new InvalidSyntaxException("--", ctx);
  };
}
