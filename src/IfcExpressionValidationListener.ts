import IfcExpressionListener from "./gen/parser/IfcExpressionListener.js";
import {
  ArrayElementListContext,
  ArrayExprContext,
  BooleanLiteralContext,
  ExprContext,
  ExprListContext,
  FunctionCallContext,
  LiteralContext,
  MethodCallChainEndContext,
  MethodCallChainInnerContext,
  NumLiteralContext,
  SEAddSubContext,
  SEArrayExprContext,
  SEBooleanBinaryOpContext,
  SEComparisonContext,
  SEFunctionCallContext,
  SELiteralContext,
  SEMethodCallContext,
  SEMulDivContext,
  SENotContext,
  SEParenthesisContext,
  SEPowerContext,
  SEUnaryMinusContext,
  SEUnaryMultipleMinusContext,
  SEVariableRefContext,
  StringLiteralContext,
  VariableRefContext,
} from "./gen/parser/IfcExpressionParser.js";
import { IfcExpressionFunctions } from "./expression/function/IfcExpressionFunctions.js";
import { NoSuchFunctionException } from "./error/NoSuchFunctionException.js";
import { InvalidSyntaxException } from "./error/InvalidSyntaxException.js";
import { Type, Types } from "./type/Types.js";
import { ParserRuleContext } from "antlr4";
import { TypeManager } from "./type/TypeManager.js";
import { ExpressionTypeError } from "./error/ExpressionTypeError.js";
import { isNullish } from "./IfcExpressionUtils.js";
import { ValidationException } from "./error/ValidationException.js";
import { ExprType } from "./type/ExprType.js";

export class IfcExpressionValidationListener extends IfcExpressionListener {
  private readonly typeManager: TypeManager;
  private methodCallTargetStack = [];
  constructor() {
    super();
    this.typeManager = new TypeManager();
  }

  public getTypeManager(): TypeManager {
    return this.typeManager;
  }

  enterFunctionCall: (ctx: FunctionCallContext) => void = (ctx) => {
    if (!IfcExpressionFunctions.isBuiltinFunction(ctx.IDENTIFIER().getText())) {
      throw new NoSuchFunctionException(ctx.IDENTIFIER().getText(), ctx);
    }
  };

  enterSEUnaryMultipleMinus: (ctx: SEUnaryMultipleMinusContext) => void = (
    ctx
  ) => {
    throw new InvalidSyntaxException("--", ctx);
  };

  exitSEBooleanBinaryOp: (ctx: SEBooleanBinaryOpContext) => void = (ctx) => {
    this.typeManager.requireBoolean(ctx._left);
    this.typeManager.requireBoolean(ctx._right);
    this.typeManager.setType(ctx, Types.boolean());
  };

  exitSEComparison: (ctx: SEComparisonContext) => void = (ctx) => {
    this.typeManager.requireTypesOverlap(ctx._left, ctx._right);
    this.typeManager.setType(ctx, Types.boolean());
  };

  exitSEParenthesis: (ctx: SEParenthesisContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  };

  exitSELiteral: (ctx: SELiteralContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  };
  exitLiteral: (ctx: LiteralContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx.getChild(0) as ParserRuleContext);
  };
  exitNumLiteral: (ctx: NumLiteralContext) => void = (ctx) => {
    this.typeManager.setType(ctx, Types.numeric());
  };
  exitStringLiteral: (ctx: StringLiteralContext) => void = (ctx) => {
    this.typeManager.setType(ctx, Types.string());
  };

  exitBooleanLiteral: (ctx: BooleanLiteralContext) => void = (ctx) => {
    this.typeManager.setType(ctx, Types.boolean());
  };

  exitExpr: (ctx: ExprContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx.singleExpr());
  };

  exitSEMulDiv: (ctx: SEMulDivContext) => void = (ctx) => {
    this.typeManager.requireNumeric(ctx._left);
    this.typeManager.requireNumeric(ctx._right);
    this.typeManager.setType(ctx, Types.numeric());
  };

  exitSEPower: (ctx: SEPowerContext) => void = (ctx) => {
    this.typeManager.requireNumeric(ctx._left);
    this.typeManager.requireNumeric(ctx._right);
    this.typeManager.setType(ctx, Types.numeric());
  };
  exitSEFunctionCall: (ctx: SEFunctionCallContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  };
  exitSEArrayExpr: (ctx: SEArrayExprContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  };

  exitSENot: (ctx: SENotContext) => void = (ctx) => {
    this.typeManager.requireBoolean(ctx._sub);
    this.typeManager.setType(ctx, Types.boolean());
  };

  exitSEVariableRef: (ctx: SEVariableRefContext) => void = (ctx) => {
    switch (ctx._sub.IDENTIFIER().getText()) {
      case "property":
        this.typeManager.setType(ctx, Type.IFC_PROPERTY_REF);
        return;
      case "element":
        this.typeManager.setType(ctx, Type.IFC_ELEMENT_REF);
        return;
    }
    throw new ValidationException(
      `Encountered Variable ref that was neither $property nor $element`,
      ctx
    );
  };

  exitSEUnaryMinus: (ctx: SEUnaryMinusContext) => void = (ctx) => {
    this.typeManager.requireNumeric(ctx._sub);
    this.typeManager.setType(ctx, Types.numeric());
  };
  exitSEAddSub: (ctx: SEAddSubContext) => void = (ctx) => {
    if (this.typeManager.overlapsWithString(ctx._left, ctx._right)) {
      this.typeManager.setType(ctx, Types.string());
    } else if (this.typeManager.overlapsWithNumeric(ctx._left, ctx._right)) {
      this.typeManager.setType(ctx, Types.numeric());
    } else {
      throw new ExpressionTypeError(
        `Operator '+' does not allow provided operand types ${this.typeManager
          .getType(ctx._left)
          .getName()}(left operand) and ${this.typeManager
          .getType(ctx._right)
          .getName()}(right operand). Operands must be both string or both numeric.`,
        ctx
      );
    }
  };

  exitSEMethodCall: (ctx: SEMethodCallContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._call);
  };

  enterMethodCallChainInner: (ctx: MethodCallChainInnerContext) => void = (
    ctx
  ) => {
    this.pushMethodCallTarget(ctx);
  };
  exitMethodCallChainInner: (ctx: MethodCallChainInnerContext) => void = (
    ctx
  ) => {
    this.typeManager.copyTypeFrom(ctx, ctx._call);
  };

  enterMethodCallChainEnd: (ctx: MethodCallChainEndContext) => void = (ctx) => {
    this.pushMethodCallTarget(ctx);
  };

  private pushMethodCallTarget(ctx: ParserRuleContext) {
    if (ctx.parentCtx["_target"]) {
      const targetType = this.typeManager.getType(ctx.parentCtx["_target"]);
      this.methodCallTargetStack.push(targetType);
    } else {
      throw new ValidationException(
        "Did not find expected context attribute 'target' in parent rule context",
        ctx
      );
    }
  }

  exitMethodCallChainEnd: (ctx: MethodCallChainEndContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx.functionCall());
  };
  exitFunctionCall: (ctx: FunctionCallContext) => void = (ctx) => {
    const func = IfcExpressionFunctions.getFunction(ctx.IDENTIFIER().getText());
    const argumentTypes = this.collectArgumentTypes(ctx.exprList());
    const parent = ctx.parentCtx;
    if (
      parent instanceof MethodCallChainInnerContext ||
      parent instanceof MethodCallChainEndContext ||
      parent instanceof SEMethodCallContext
    ) {
      argumentTypes.unshift(this.methodCallTargetStack.pop());
    }
    const returnType = func.checkArgumentsAndGetReturnType(argumentTypes, ctx);
    this.typeManager.setType(ctx, returnType);
  };

  private collectArgumentTypes: (
    ctx: ExprListContext,
    resultSoFar?: Array<ExprType>
  ) => Array<ExprType> = (ctx, resultSoFar?: Array<ExprType>) => {
    if (isNullish(resultSoFar)) {
      resultSoFar = [];
    }
    if (!isNullish(ctx)) {
      resultSoFar.push(this.typeManager.getType(ctx.singleExpr()));
      const rest = ctx.exprList();
      if (!isNullish(rest)) {
        return this.collectArgumentTypes(rest, resultSoFar);
      }
    }
    return resultSoFar;
  };

  exitExprList: (ctx: ExprListContext) => void;

  exitArrayExpr: (ctx: ArrayExprContext) => void = (ctx) => {
    this.typeManager.setType(
      ctx,
      Types.tuple(...this.collectArrayElementTypes(ctx.arrayElementList()))
    );
  };

  private collectArrayElementTypes: (
    ctx: ArrayElementListContext,
    resultSoFar?: Array<ExprType>
  ) => Array<ExprType> = (ctx, resultSoFar?: Array<ExprType>) => {
    if (isNullish(resultSoFar)) {
      resultSoFar = [];
    }
    if (!isNullish(ctx)) {
      resultSoFar.push(this.typeManager.getType(ctx.singleExpr()));
      const rest = ctx.arrayElementList();
      if (!isNullish(rest)) {
        return this.collectArrayElementTypes(rest, resultSoFar);
      }
    }
    return resultSoFar;
  };

  exitArrayElementList: (ctx: ArrayElementListContext) => void;
  exitVariableRef: (ctx: VariableRefContext) => void = (ctx) => {
    this.typeManager.setType(
      ctx,
      Types.or(Type.IFC_PROPERTY_REF, Type.IFC_ELEMENT_REF)
    );
  };
}
