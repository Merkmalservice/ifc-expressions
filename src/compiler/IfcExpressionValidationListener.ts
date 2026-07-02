import IfcExpressionListener from "../gen/parser/IfcExpressionListener.js";
import {
  ArrayElementListContext,
  ArrayExprContext,
  BooleanLiteralContext,
  ExprContext,
  ExprListContext,
  FunctionCallContext,
  LiteralContext,
  LogicalLiteralContext,
  MethodCallChainEndContext,
  MethodCallChainInnerContext,
  MethodFunctionCallContext,
  MethodPropertyAccessContext,
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
} from "../gen/parser/IfcExpressionParser.js";
import { IfcExpressionFunctions } from "../expression/function/IfcExpressionFunctions.js";
import { NoSuchFunctionException } from "../error/NoSuchFunctionException.js";
import { InvalidSyntaxException } from "../error/InvalidSyntaxException.js";
import { Type, Types } from "../type/Types.js";
import { ParserRuleContext } from "antlr4";
import { TypeManager } from "./TypeManager.js";
import { ExpressionTypeError } from "../error/ExpressionTypeError.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { ValidationException } from "../error/ValidationException.js";
import { ExprType } from "../type/ExprType.js";
import {
  BuiltinVariableRegistry,
  isBuiltinFunctionDefinition,
  isBuiltinPropertyDefinition,
} from "../builtin/BuiltinVariableRegistry.js";
import { ContextObjectType } from "../type/ContextObjectType.js";
import { NoSuchMemberException } from "../error/NoSuchMemberException.js";
import { NoSuchMethodException } from "../error/NoSuchMethodException.js";
import { WrongFunctionArgumentTypeException } from "../error/WrongFunctionArgumentTypeException.js";
import { MissingFunctionArgumentException } from "../error/MissingFunctionArgumentException.js";
import { SpuriousFunctionArgumentException } from "../error/SpuriousFunctionArgumentException.js";

export class IfcExpressionValidationListener extends IfcExpressionListener {
  private readonly typeManager: TypeManager;
  private methodCallTargetStack: Array<[ParserRuleContext, ExprType]> = [];
  private readonly builtinVariableRegistry: BuiltinVariableRegistry;

  constructor(
    builtinVariableRegistry: BuiltinVariableRegistry = BuiltinVariableRegistry.getDefaultRegistry()
  ) {
    super();
    this.typeManager = new TypeManager();
    this.builtinVariableRegistry = builtinVariableRegistry;
  }

  public getTypeManager(): TypeManager {
    return this.typeManager;
  }

  enterFunctionCall: (ctx: FunctionCallContext) => void = (ctx) => {
    if (!IfcExpressionFunctions.isBuiltinFunction(ctx.IDENTIFIER().getText())) {
      const parent = ctx.parentCtx;
      const grandParent = parent?.parentCtx;
      const isMethodAccessor =
        parent instanceof MethodFunctionCallContext &&
        (grandParent instanceof MethodCallChainInnerContext ||
          grandParent instanceof MethodCallChainEndContext);
      if (!isMethodAccessor) {
        throw new NoSuchFunctionException(ctx.IDENTIFIER().getText(), ctx);
      }
    }
  };

  enterSEUnaryMultipleMinus: (ctx: SEUnaryMultipleMinusContext) => void = (
    ctx
  ) => {
    throw new InvalidSyntaxException("--", ctx);
  };

  exitSEBooleanBinaryOp: (ctx: SEBooleanBinaryOpContext) => void = (ctx) => {
    this.typeManager.requireLogicalOrBoolean(ctx._left);
    this.typeManager.requireLogicalOrBoolean(ctx._right);
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

  exitLogicalLiteral: (ctx: LogicalLiteralContext) => void = (ctx) => {
    this.typeManager.setType(ctx, Types.logical());
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
    this.typeManager.requireLogicalOrBoolean(ctx._sub);
    this.typeManager.setType(ctx, Types.boolean());
  };

  exitSEVariableRef: (ctx: SEVariableRefContext) => void = (ctx) => {
    const builtin = this.builtinVariableRegistry.getDefinition(
      ctx._sub.IDENTIFIER().getText()
    );
    if (builtin) {
      this.typeManager.setType(ctx, builtin.type);
      return;
    }
    throw new ValidationException(
      `Encountered Variable ref that was neither a built-in variable nor a configured client builtin`,
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
      this.methodCallTargetStack.push([ctx.parentCtx["_target"], targetType]);
    } else {
      throw new ValidationException(
        "Did not find expected context attribute 'target' in parent rule context",
        ctx
      );
    }
  }

  exitMethodCallChainEnd: (ctx: MethodCallChainEndContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx._call);
  };


  exitMethodFunctionCall: (ctx: MethodFunctionCallContext) => void = (ctx) => {
    this.typeManager.copyTypeFrom(ctx, ctx.functionCall());
  };

  exitMethodPropertyAccess: (ctx: MethodPropertyAccessContext) => void = (ctx) => {
    const [_, targetType] = this.popMethodCallTarget(ctx);
    if (!(targetType instanceof ContextObjectType)) {
      throw new NoSuchMemberException(ctx.IDENTIFIER().getText(), targetType.getName(), ctx);
    }
    const member = targetType.getMemberDefinition(ctx.IDENTIFIER().getText());
    if (!isBuiltinPropertyDefinition(member)) {
      throw new NoSuchMemberException(ctx.IDENTIFIER().getText(), targetType.getName(), ctx);
    }
    this.typeManager.setType(ctx, member.valueType);
  };

  exitFunctionCall: (ctx: FunctionCallContext) => void = (ctx) => {
    const argumentTypes = this.collectArgumentTypes(ctx.exprList());
    const parent = ctx.parentCtx;
    const grandParent = parent?.parentCtx;
    const isMethodAccessor =
      parent instanceof MethodFunctionCallContext &&
      (grandParent instanceof MethodCallChainInnerContext ||
        grandParent instanceof MethodCallChainEndContext);

    if (isMethodAccessor) {
      const [targetCtx, targetType] = this.popMethodCallTarget(ctx);
      if (targetType instanceof ContextObjectType) {
        const member = targetType.getMemberDefinition(ctx.IDENTIFIER().getText());
        if (!isBuiltinFunctionDefinition(member)) {
          throw new NoSuchMethodException(
            ctx.IDENTIFIER().getText(),
            targetType.getName(),
            ctx
          );
        }
        this.checkBuiltinFunctionArguments(
          ctx.IDENTIFIER().getText(),
          member.argumentTypes,
          argumentTypes,
          ctx
        );
        this.typeManager.setType(ctx, member.returnType);
        return;
      }
      argumentTypes.unshift([targetCtx, targetType]);
    }

    const func = IfcExpressionFunctions.getFunction(ctx.IDENTIFIER().getText());
    if (isNullish(func)) {
      throw new NoSuchFunctionException(ctx.IDENTIFIER().getText(), ctx);
    }
    const returnType = func.checkArgumentsAndGetReturnType(argumentTypes, ctx);
    this.typeManager.setType(ctx, returnType);
  };

  private checkBuiltinFunctionArguments(
    functionName: string,
    expectedArgumentTypes: Array<ExprType>,
    providedArgumentTypes: Array<[ParserRuleContext, ExprType]>,
    ctx: ParserRuleContext
  ) {
    if (providedArgumentTypes.length > expectedArgumentTypes.length) {
      throw new SpuriousFunctionArgumentException(
        functionName,
        "[unexpected argument]",
        expectedArgumentTypes.length,
        ctx,
        `Function expects (at most) ${expectedArgumentTypes.length} arguments`
      );
    }
    for (let i = 0; i < expectedArgumentTypes.length; i++) {
      if (providedArgumentTypes.length <= i) {
        throw new MissingFunctionArgumentException(
          functionName,
          `[arg${i}]`,
          i,
          ctx
        );
      }
      Types.requireWeakIsAssignableFrom(
        expectedArgumentTypes[i],
        providedArgumentTypes[i][1],
        () =>
          new WrongFunctionArgumentTypeException(
            functionName,
            `[arg${i}]`,
            expectedArgumentTypes[i],
            providedArgumentTypes[i][1],
            i,
            providedArgumentTypes[i][0]
          )
      );
    }
  }

  private popMethodCallTarget(ctx: ParserRuleContext): [ParserRuleContext, ExprType] {
    const target = this.methodCallTargetStack.pop();
    if (isNullish(target)) {
      throw new ValidationException(
        "Did not find expected method call target on stack",
        ctx
      );
    }
    return target;
  }

  private collectArgumentTypes: (
    ctx: ExprListContext,
    resultSoFar?: Array<[ParserRuleContext, ExprType]>
  ) => Array<[ParserRuleContext, ExprType]> = (
    ctx,
    resultSoFar?: Array<[ParserRuleContext, ExprType]>
  ) => {
    if (isNullish(resultSoFar)) {
      resultSoFar = [];
    }
    if (!isNullish(ctx)) {
      resultSoFar.push([
        ctx.singleExpr(),
        this.typeManager.getType(ctx.singleExpr()),
      ]);
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
    const builtinTypes = [Type.IFC_PROPERTY_REF, Type.IFC_ELEMENT_REF];
    const otherBuiltinDefinitions = ["property", "element"]
      .map((name) => this.builtinVariableRegistry.getDefinition(name)?.type)
      .filter((type) => !isNullish(type));
    this.typeManager.setType(
      ctx,
      Types.or(...builtinTypes, ...otherBuiltinDefinitions)
    );
  };
}



