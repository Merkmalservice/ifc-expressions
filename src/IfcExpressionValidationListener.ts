import IfcExpressionListener from "./gen/parser/IfcExpressionListener.js";
import {
  ArrayElementListContext,
  ArrayExprContext,
  BooleanLiteralContext,
  ExprContext,
  ExprListContext,
  FunctionCallContext,
  LiteralContext, MethodCallChainContext,
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
import {IfcExpressionFunctions} from "./expression/function/IfcExpressionFunctions.js";
import {NoSuchFunctionException} from "./error/NoSuchFunctionException.js";
import {InvalidSyntaxException} from "./error/InvalidSyntaxException.js";
import {Type, Types} from "./parse/Types";
import {ParserRuleContext} from "antlr4";
import {TypeManager} from "./parse/TypeManager";
import {PlusExpr} from "./expression/numeric/PlusExpr";
import {StringConcatExpr} from "./expression/string/StringConcatExpr";
import {PlusOrConcatExpr} from "./expression/poly/PlusOrConcatExpr";
import {ExpressionTypeError} from "./error/ExpressionTypeError";
import {Func} from "./expression/function/Func";
import {Expr} from "./expression/Expr";
import {isNullish} from "./IfcExpressionUtils";
import {ValidationException} from "./error/ValidationException";

export class IfcExpressionValidationListener extends IfcExpressionListener {

  private readonly typeManager: TypeManager;
  private methodCallTargetStack = [];
  constructor() {
    super();
    this.typeManager = new TypeManager();
  }

  public getTypeManager():TypeManager {
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

  exitSEBooleanBinaryOp: (ctx: SEBooleanBinaryOpContext) => void = ctx => {
    this.typeManager.requireBoolean(ctx._left);
    this.typeManager.requireBoolean(ctx._right);
    this.typeManager.setType(ctx, Types.boolean());
  }

  exitSEComparison: (ctx: SEComparisonContext) => void = ctx => {
    this.typeManager.requireTypesOverlap(ctx._left, ctx._right);
    this.typeManager.setType(ctx, Types.boolean());
  }

  exitSEParenthesis: (ctx: SEParenthesisContext) => void = ctx =>{
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  }

  exitSELiteral: (ctx: SELiteralContext) => void = ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  }
  exitLiteral: (ctx: LiteralContext) => void  = ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx.getChild(0) as ParserRuleContext);
  }
  exitNumLiteral: (ctx: NumLiteralContext) => void  = ctx => {
    this.typeManager.setType(ctx, Types.numeric());
  }
  exitStringLiteral: (ctx: StringLiteralContext) => void  = ctx => {
    this.typeManager.setType(ctx, Types.string());
  }

  exitBooleanLiteral: (ctx: BooleanLiteralContext) => void = ctx => {
    this.typeManager.setType(ctx, Types.boolean());
  }

  exitExpr: (ctx: ExprContext) => void = ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx.singleExpr());
  }

  exitSEMulDiv: (ctx: SEMulDivContext) => void = ctx => {
    this.typeManager.requireNumeric(ctx._left);
    this.typeManager.requireNumeric(ctx._right);
    this.typeManager.setType(ctx, Types.numeric());
  }

  exitSEPower: (ctx: SEPowerContext) => void = ctx => {
    this.typeManager.requireNumeric(ctx._left);
    this.typeManager.requireNumeric(ctx._right);
    this.typeManager.setType(ctx, Types.numeric());
  }
  exitSEFunctionCall: (ctx: SEFunctionCallContext) => void = ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  }
  exitSEArrayExpr: (ctx: SEArrayExprContext) => void = ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx._sub);
  }

  exitSENot: (ctx: SENotContext) => void = ctx => {
    this.typeManager.requireBoolean(ctx._sub);
    this.typeManager.setType(ctx, Types.boolean());
  }

  exitSEVariableRef: (ctx: SEVariableRefContext) => void = ctx => {
    this.typeManager.setType(ctx, Types.ifcObjectRef())
  };
  exitSEUnaryMinus: (ctx: SEUnaryMinusContext) => void = ctx => {
    this.typeManager.requireNumeric(ctx._sub);
    this.typeManager.setType(ctx, Types.numeric());
  }
  exitSEAddSub: (ctx: SEAddSubContext) => void = ctx => {
    if (this.typeManager.isTypeOrBroader(Type.STRING, ctx._left, ctx._right)){
      this.typeManager.setType(ctx, Types.string());
    } else if (this.typeManager.isTypeOrBroader(Type.NUMERIC, ctx._left, ctx._right)) {
      this.typeManager.setType(ctx, Types.numeric());
    } else {
      throw new ExpressionTypeError(`Operator '+' does not allow provided operand types ${this.typeManager.getType(ctx._left)}(left operand) and ${this.typeManager.getType(ctx._right)}(right operand). Operands must be both string or both numeric.`, ctx);
    }
  }

  exitSEMethodCall: (ctx: SEMethodCallContext) => void= ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx._call);
  }

  enterMethodCallChainInner: (ctx: MethodCallChainInnerContext) => void = ctx => {
    this.pushMethodCallTarget(ctx);
  }
  exitMethodCallChainInner: (ctx: MethodCallChainInnerContext) => void= ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx._call);
  }

  enterMethodCallChainEnd: (ctx: MethodCallChainEndContext) => void = ctx => {
    this.pushMethodCallTarget(ctx);
  }

  private pushMethodCallTarget(ctx: ParserRuleContext) {
    if (ctx.parentCtx["_target"]) {
      const targetType = this.typeManager.getType(ctx.parentCtx["_target"]);
      this.methodCallTargetStack.push(targetType);
    } else {
      throw new ValidationException("Did not find expected context attribute 'target' in parent rule context", ctx);
    }
  }

  exitMethodCallChainEnd: (ctx: MethodCallChainEndContext) => void= ctx => {
    this.typeManager.copyTypeFrom(ctx, ctx.functionCall());
  };
  exitFunctionCall: (ctx: FunctionCallContext) => void = ctx => {
    const func = IfcExpressionFunctions.getFunction(ctx.IDENTIFIER().getText());
    const argumentTypes = this.collectArgumentTypes(ctx.exprList());
    const parent = ctx.parentCtx;
    if (parent instanceof MethodCallChainInnerContext || parent instanceof MethodCallChainEndContext || parent instanceof SEMethodCallContext) {
      argumentTypes.unshift(this.methodCallTargetStack.pop());
    }
    func.checkArgumentTypes(argumentTypes, ctx);
    this.typeManager.setType(ctx, func.getReturnType());
  }

  private collectArgumentTypes: (
      ctx: ExprListContext,
      resultSoFar?: Array<Type>
  ) => Array<Type> = (ctx, resultSoFar?: Array<Type>) => {
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
  exitArrayExpr: (ctx: ArrayExprContext) => void  = ctx => {
    this.typeManager.setType(ctx, Types.array())
  }
  exitArrayElementList: (ctx: ArrayElementListContext) => void
  exitVariableRef: (ctx: VariableRefContext) => void = ctx => {
    this.typeManager.setType(ctx, Types.unknown());
  }

}
