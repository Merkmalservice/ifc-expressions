import IfcExpressionVisitor from "./gen/parser/IfcExpressionVisitor.js";
import { NumericLiteralExpr } from "./expression/numeric/NumericLiteralExpr.js";
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
import { Expr } from "./expression/Expr.js";
import { isNullish, isPresent } from "./IfcExpressionUtils.js";
import Decimal from "decimal.js";
import { PlusExpr } from "./expression/numeric/PlusExpr.js";
import { MinusExpr } from "./expression/numeric/MinusExpr.js";
import { ParserRuleContext } from "antlr4";
import { MultiplyExpr } from "./expression/numeric/MultiplyExpr.js";
import { DivideExpr } from "./expression/numeric/DivideExpr.js";
import { PropObjectReferenceExpr } from "./expression/reference/PropObjectReferenceExpr.js";
import { ElemObjectReferenceExpr } from "./expression/reference/ElemObjectReferenceExpr.js";
import { StringLiteralExpr } from "./expression/string/StringLiteralExpr.js";
import { ArrayExpr } from "./expression/structure/ArrayExpr.js";
import { FunctionExpr } from "./expression/function/FunctionExpr.js";
import { PowerExpr } from "./expression/numeric/PowerExpr.js";
import { UnaryMinusExpr } from "./expression/numeric/UnaryMinusExpr.js";
import { AndExpr } from "./expression/boolean/AndExpr.js";
import { BooleanLiteralExpr } from "./expression/boolean/BooleanLiteralExpr.js";
import { OrExpr } from "./expression/boolean/OrExpr.js";
import { XorExpr } from "./expression/boolean/XorExpr.js";
import { SyntaxErrorException } from "./error/SyntaxErrorException.js";
import { NotExpr } from "./expression/boolean/NotExpr.js";
import { ParenthesisExpr } from "./expression/structure/ParenthesisExpr.js";
import { EqualsExpr } from "./expression/comparison/EqualsExpr.js";
import { NotEqualsExpr } from "./expression/comparison/NotEqualsExpr.js";
import { TypeManager } from "./type/TypeManager.js";
import { StringConcatExpr } from "./expression/string/StringConcatExpr.js";
import { PlusOrConcatExpr } from "./expression/poly/PlusOrConcatExpr.js";
import { ExpressionTypeError } from "./error/ExpressionTypeError.js";
import { GreaterThan } from "./expression/comparison/GreaterThan.js";
import { GreaterThanOrEqual } from "./expression/comparison/GreaterThanOrEqual.js";
import { LessThan } from "./expression/comparison/LessThan.js";
import { LessThanOrEqual } from "./expression/comparison/LessThanOrEqual.js";

export class ExprVisitor extends IfcExpressionVisitor<Expr<any>> {
  private readonly methodCallTargetStack = [];
  private readonly typeManager: TypeManager;

  constructor(typeManager: TypeManager) {
    super();
    this.typeManager = typeManager;
  }

  visitExpr: (ctx: ExprContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.singleExpr());
  };

  /*================================================
   * VariableRef
   *==============================================*/

  visitVariableRef: (ctx: VariableRefContext) => Expr<any> = (ctx) => {
    if (ctx.IDENTIFIER().getText().toUpperCase() === "PROPERTY") {
      return new PropObjectReferenceExpr();
    } else if (ctx.IDENTIFIER().getText().toUpperCase() === "ELEMENT") {
      return new ElemObjectReferenceExpr();
    }
    throw new Error(`Parsing error: No variable '${ctx.getText()}' found  `);
  };

  visitSEComparison: (ctx: SEComparisonContext) => Expr<any> = (ctx) => {
    const left = this.visit(ctx.singleExpr(0));
    const right = this.visit(ctx.singleExpr(1));
    switch (ctx.CMP_OP().getText()) {
      case "==":
        return new EqualsExpr(left, right);
      case "!=":
        return new NotEqualsExpr(left, right);
      case ">":
        return new GreaterThan(left, right);
      case ">=":
        return new GreaterThanOrEqual(left, right);
      case "<":
        return new LessThan(left, right);
      case "<=":
        return new LessThanOrEqual(left, right);
    }
    throw new Error(
      `Parsing error: comparison operator '${ctx
        .CMP_OP()
        .getText()}' not supported`
    );
  };

  visitSEMethodCall: (ctx: SEMethodCallContext) => Expr<any> = (ctx) => {
    this.methodCallTargetStack.push(this.visit(ctx.singleExpr()));
    return this.visit(ctx.methodCallChain());
  };

  visitSELiteral: (ctx: SELiteralContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.literal());
  };

  visitSEVariableRef: (ctx: SEVariableRefContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.variableRef());
  };
  visitSEArrayExpr: (ctx: SEArrayExprContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.arrayExpr());
  };
  visitSEFunctionCall: (ctx: SEFunctionCallContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.functionCall());
  };
  visitSEParenthesis: (ctx: SEParenthesisContext) => Expr<any> = (ctx) => {
    return new ParenthesisExpr(this.visit(ctx._sub));
  };

  /*================================================
   * MethodCallChain
   *==============================================*/

  visitMethodCallChainInner: (ctx: MethodCallChainInnerContext) => Expr<any> = (
    ctx
  ) => {
    this.methodCallTargetStack.push(
      new FunctionExpr(
        ctx.functionCall().IDENTIFIER().getText(),
        this.collectFunctionArguments(ctx.functionCall().exprList(), [
          this.methodCallTargetStack.pop(),
        ])
      )
    );
    return this.visit(ctx.methodCallChain());
  };

  visitMethodCallChainEnd: (ctx: MethodCallChainEndContext) => Expr<any> = (
    ctx
  ) => {
    return new FunctionExpr(
      ctx.functionCall().IDENTIFIER().getText(),
      this.collectFunctionArguments(ctx.functionCall().exprList(), [
        this.methodCallTargetStack.pop(),
      ])
    );
  };

  visitSEAddSub: (ctx: SEAddSubContext) => Expr<any> = (ctx) => {
    this.typeManager.requireTypesOverlap(ctx._left, ctx._right);
    switch (ctx._op.text) {
      case "+":
        return this.makePlusExpr(ctx);
      case "-":
        return new MinusExpr(this.visit(ctx._left), this.visit(ctx._right));
      default:
        ExprVisitor.failNode(ctx);
    }
  };

  private makePlusExpr(ctx: SEAddSubContext) {
    if (this.typeManager.isNumeric(ctx._left, ctx._right)) {
      return new PlusExpr(this.visit(ctx._left), this.visit(ctx._right));
    }
    if (this.typeManager.isString(ctx._left, ctx._right)) {
      return new StringConcatExpr(
        this.visit(ctx._left),
        this.visit(ctx._right)
      );
    }
    if (
      this.typeManager.overlapsWithString(ctx._left, ctx._right) ||
      this.typeManager.overlapsWithNumeric(ctx._left, ctx._right)
    ) {
      return new PlusOrConcatExpr(
        this.visit(ctx._left),
        this.visit(ctx._right)
      );
    }
    throw new ExpressionTypeError(
      "Operator '+' requires the operands to be either both of type numeric or both of type string, but they are not.",
      ctx
    );
  }

  visitSEMulDiv: (ctx: SEMulDivContext) => Expr<any> = (ctx) => {
    switch (ctx._op.text) {
      case "*":
        return new MultiplyExpr(
          this.visit(ctx.getChild(0)),
          this.visit(ctx.getChild(2))
        );
      case "/":
        return new DivideExpr(
          this.visit(ctx.getChild(0)),
          this.visit(ctx.getChild(2))
        );
      default:
        ExprVisitor.failNode(ctx);
    }
  };

  /*================================================
   * StringExpr
   *===============================================*/

  visitStringLiteral: (ctx: StringLiteralContext) => Expr<any> = (ctx) => {
    const quotedString = ctx.QUOTED_STRING().getText();
    const text = quotedString.substring(1, quotedString.length - 1);
    return new StringLiteralExpr(text);
  };

  /*================================================
   * NumExpr
   *===============================================*/

  visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = (ctx) => {
    let val = ctx.INT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(new Decimal(ctx.getText()));
    }
    val = ctx.FLOAT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(new Decimal(ctx.getText()));
    }
    ExprVisitor.failNode(ctx);
  };

  visitSEUnaryMultipleMinus: (ctx: SEUnaryMultipleMinusContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.singleExpr());
  };
  visitSEPower: (ctx: SEPowerContext) => Expr<any> = (ctx) => {
    return new PowerExpr(
      this.visit(ctx.getChild(0)),
      this.visit(ctx.getChild(1))
    );
  };
  visitSEUnaryMinus: (ctx: SEUnaryMinusContext) => Expr<any> = (ctx) => {
    return new UnaryMinusExpr(this.visit(ctx.singleExpr()));
  };

  /*================================================
   * BooleanExpr
   *===============================================*/

  visitSEBooleanBinaryOp: (ctx: SEBooleanBinaryOpContext) => Expr<any> = (
    ctx
  ) => {
    switch (ctx._op.text) {
      case "&&":
        return new AndExpr(
          this.visit(ctx.singleExpr(0)),
          this.visit(ctx.singleExpr(1))
        );
      case "||":
        return new OrExpr(
          this.visit(ctx.singleExpr(0)),
          this.visit(ctx.singleExpr(1))
        );
      case "><":
        return new XorExpr(
          this.visit(ctx.singleExpr(0)),
          this.visit(ctx.singleExpr(1))
        );
    }
    throw new SyntaxErrorException(
      ctx._op.text,
      ctx._op.line,
      ctx._op.column,
      `Unknown boolean operator ${ctx._op.text}`
    );
  };

  visitBooleanLiteral: (ctx: BooleanLiteralContext) => Expr<any> = (ctx) => {
    return new BooleanLiteralExpr(
      ctx.BOOLEAN().getText().toUpperCase() === "TRUE"
    );
  };

  visitSENot: (ctx: SENotContext) => Expr<any> = (ctx) => {
    return new NotExpr(this.visit(ctx.singleExpr()));
  };

  /*================================================
   * ArrayExpr
   *===============================================*/

  visitArrayExpr: (ctx: ArrayExprContext) => Expr<any> = (ctx) => {
    return new ArrayExpr(this.collectArrayElements(ctx.arrayElementList()));
  };

  collectArrayElements: (ctx: ArrayElementListContext) => Array<Expr<any>> = (
    ctx
  ) => {
    const first = this.visit(ctx.singleExpr());
    const rest = ctx.arrayElementList();
    if (!isNullish(rest)) {
      const arr = this.collectArrayElements(rest);
      arr.unshift(first);
      return arr;
    }
    return [first];
  };

  /*================================================
   * FuncExpr
   *===============================================*/

  visitFunctionCall: (ctx: FunctionCallContext) => Expr<any> = (ctx) => {
    const args = isNullish(ctx.exprList())
      ? []
      : this.collectFunctionArguments(ctx.exprList());
    return new FunctionExpr(ctx.IDENTIFIER().getText(), args);
  };

  collectFunctionArguments: (
    ctx: ExprListContext,
    resultSoFar?: Array<Expr<any>>
  ) => Array<Expr<any>> = (ctx, resultSoFar?: Array<Expr<any>>) => {
    if (isNullish(resultSoFar)) {
      resultSoFar = [];
    }
    if (!isNullish(ctx)) {
      resultSoFar.push(this.visit(ctx.singleExpr()));
      const rest = ctx.exprList();
      if (!isNullish(rest)) {
        return this.collectFunctionArguments(rest, resultSoFar);
      }
    }
    return resultSoFar;
  };

  private static failNode(ctx: ParserRuleContext) {
    throw new Error(`Cannot parse (sub)expression ${ctx.getText()}`);
  }

  visitLiteral: (ctx: LiteralContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.getChild(0));
  };
}
