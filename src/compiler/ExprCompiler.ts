import IfcExpressionVisitor from "../gen/parser/IfcExpressionVisitor.js";
import { NumericLiteralExpr } from "../expression/numeric/NumericLiteralExpr.js";
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
import { Expr } from "../expression/Expr.js";
import { isNullish, isPresent } from "../util/IfcExpressionUtils.js";
import Decimal from "decimal.js";
import { PlusExpr } from "../expression/numeric/PlusExpr.js";
import { MinusExpr } from "../expression/numeric/MinusExpr.js";
import { ParserRuleContext } from "antlr4";
import { MultiplyExpr } from "../expression/numeric/MultiplyExpr.js";
import { DivideExpr } from "../expression/numeric/DivideExpr.js";
import { PropObjectReferenceExpr } from "../expression/reference/PropObjectReferenceExpr.js";
import { ElemObjectReferenceExpr } from "../expression/reference/ElemObjectReferenceExpr.js";
import { StringLiteralExpr } from "../expression/string/StringLiteralExpr.js";
import { ArrayExpr } from "../expression/structure/ArrayExpr.js";
import { FunctionExpr } from "../expression/function/FunctionExpr.js";
import { PowerExpr } from "../expression/numeric/PowerExpr.js";
import { UnaryMinusExpr } from "../expression/numeric/UnaryMinusExpr.js";
import { AndExpr } from "../expression/boolean/AndExpr.js";
import { BooleanLiteralExpr } from "../expression/boolean/BooleanLiteralExpr.js";
import { OrExpr } from "../expression/boolean/OrExpr.js";
import { XorExpr } from "../expression/boolean/XorExpr.js";
import { SyntaxErrorException } from "../error/SyntaxErrorException.js";
import { NotExpr } from "../expression/boolean/NotExpr.js";
import { ParenthesisExpr } from "../expression/structure/ParenthesisExpr.js";
import { EqualsExpr } from "../expression/comparison/EqualsExpr.js";
import { NotEqualsExpr } from "../expression/comparison/NotEqualsExpr.js";
import { TypeManager } from "./TypeManager.js";
import { StringConcatExpr } from "../expression/string/StringConcatExpr.js";
import { PlusOrConcatExpr } from "../expression/poly/PlusOrConcatExpr.js";
import { ExpressionTypeError } from "../error/ExpressionTypeError.js";
import { GreaterThan } from "../expression/comparison/GreaterThan.js";
import { GreaterThanOrEqual } from "../expression/comparison/GreaterThanOrEqual.js";
import { LessThan } from "../expression/comparison/LessThan.js";
import { LessThanOrEqual } from "../expression/comparison/LessThanOrEqual.js";
import { ExprManager } from "./ExprManager.js";
import { LogicalValue } from "../value/LogicalValue";
import { LogicalLiteralExpr } from "../expression/boolean/LogicalLiteralExpr";

export class ExprCompiler extends IfcExpressionVisitor<Expr<any>> {
  private readonly methodCallTargetStack = [];
  private readonly typeManager: TypeManager;
  private readonly exprManager: ExprManager;

  constructor(typeManager: TypeManager) {
    super();
    this.typeManager = typeManager;
    this.exprManager = new ExprManager();
  }

  public getExprManager(): ExprManager {
    return this.exprManager;
  }

  visitExpr: (ctx: ExprContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.singleExpr());
  };

  /*================================================
   * VariableRef
   *==============================================*/

  private associateContextAndReturn(expr: Expr<any>, ctx: ParserRuleContext) {
    this.exprManager.registerExprWithContext(expr, ctx);
    return expr;
  }

  visitVariableRef: (ctx: VariableRefContext) => Expr<any> = (ctx) => {
    if (ctx.IDENTIFIER().getText().toUpperCase() === "PROPERTY") {
      return this.associateContextAndReturn(new PropObjectReferenceExpr(), ctx);
    } else if (ctx.IDENTIFIER().getText().toUpperCase() === "ELEMENT") {
      return this.associateContextAndReturn(new ElemObjectReferenceExpr(), ctx);
    }
    throw new Error(`Parsing error: No variable '${ctx.getText()}' found  `);
  };

  visitSEComparison: (ctx: SEComparisonContext) => Expr<any> = (ctx) => {
    const left = this.visit(ctx.singleExpr(0));
    const right = this.visit(ctx.singleExpr(1));
    switch (ctx.CMP_OP().getText()) {
      case "==":
        return this.associateContextAndReturn(new EqualsExpr(left, right), ctx);
      case "!=":
        return this.associateContextAndReturn(
          new NotEqualsExpr(left, right),
          ctx
        );
      case ">":
        return this.associateContextAndReturn(
          new GreaterThan(left, right),
          ctx
        );
      case ">=":
        return this.associateContextAndReturn(
          new GreaterThanOrEqual(left, right),
          ctx
        );
      case "<":
        return this.associateContextAndReturn(new LessThan(left, right), ctx);
      case "<=":
        return this.associateContextAndReturn(
          new LessThanOrEqual(left, right),
          ctx
        );
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
    return this.associateContextAndReturn(
      new ParenthesisExpr(this.visit(ctx._sub)),
      ctx
    );
  };

  /*================================================
   * MethodCallChain
   *==============================================*/

  visitMethodCallChainInner: (ctx: MethodCallChainInnerContext) => Expr<any> = (
    ctx
  ) => {
    const functionExpr = new FunctionExpr(
      ctx.functionCall().IDENTIFIER().getText(),
      this.collectFunctionArguments(ctx.functionCall().exprList(), [
        this.methodCallTargetStack.pop(),
      ])
    );
    this.associateContextAndReturn(functionExpr, ctx.functionCall());
    this.methodCallTargetStack.push(functionExpr);
    return this.visit(ctx.methodCallChain());
  };

  visitMethodCallChainEnd: (ctx: MethodCallChainEndContext) => Expr<any> = (
    ctx
  ) => {
    return this.associateContextAndReturn(
      new FunctionExpr(
        ctx.functionCall().IDENTIFIER().getText(),
        this.collectFunctionArguments(ctx.functionCall().exprList(), [
          this.methodCallTargetStack.pop(),
        ])
      ),
      ctx.functionCall()
    );
  };

  visitSEAddSub: (ctx: SEAddSubContext) => Expr<any> = (ctx) => {
    this.typeManager.requireTypesOverlap(ctx._left, ctx._right);
    switch (ctx._op.text) {
      case "+":
        return this.makePlusExpr(ctx);
      case "-":
        return this.associateContextAndReturn(
          new MinusExpr(this.visit(ctx._left), this.visit(ctx._right)),
          ctx
        );
      default:
        ExprCompiler.failNode(ctx);
    }
  };

  private makePlusExpr(ctx: SEAddSubContext) {
    if (this.typeManager.isNumeric(ctx._left, ctx._right)) {
      return this.associateContextAndReturn(
        new PlusExpr(this.visit(ctx._left), this.visit(ctx._right)),
        ctx
      );
    }
    if (this.typeManager.isString(ctx._left, ctx._right)) {
      return this.associateContextAndReturn(
        new StringConcatExpr(this.visit(ctx._left), this.visit(ctx._right)),
        ctx
      );
    }
    if (
      this.typeManager.overlapsWithString(ctx._left, ctx._right) ||
      this.typeManager.overlapsWithNumeric(ctx._left, ctx._right)
    ) {
      return this.associateContextAndReturn(
        new PlusOrConcatExpr(this.visit(ctx._left), this.visit(ctx._right)),
        ctx
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
        return this.associateContextAndReturn(
          new MultiplyExpr(
            this.visit(ctx.getChild(0)),
            this.visit(ctx.getChild(2))
          ),
          ctx
        );
      case "/":
        return this.associateContextAndReturn(
          new DivideExpr(
            this.visit(ctx.getChild(0)),
            this.visit(ctx.getChild(2))
          ),
          ctx
        );
      default:
        ExprCompiler.failNode(ctx);
    }
  };

  /*================================================
   * StringExpr
   *===============================================*/

  visitStringLiteral: (ctx: StringLiteralContext) => Expr<any> = (ctx) => {
    const quotedString = ctx.QUOTED_STRING().getText();
    const text = quotedString.substring(1, quotedString.length - 1);
    return this.associateContextAndReturn(new StringLiteralExpr(text), ctx);
  };

  /*================================================
   * NumExpr
   *===============================================*/

  visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = (ctx) => {
    let val = ctx.INT();
    if (isPresent(val)) {
      return this.associateContextAndReturn(
        new NumericLiteralExpr(new Decimal(ctx.getText())),
        ctx
      );
    }
    val = ctx.FLOAT();
    if (isPresent(val)) {
      return this.associateContextAndReturn(
        new NumericLiteralExpr(new Decimal(ctx.getText())),
        ctx
      );
    }
    ExprCompiler.failNode(ctx);
  };

  visitSEUnaryMultipleMinus: (ctx: SEUnaryMultipleMinusContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.singleExpr());
  };
  visitSEPower: (ctx: SEPowerContext) => Expr<any> = (ctx) => {
    return this.associateContextAndReturn(
      new PowerExpr(this.visit(ctx._left), this.visit(ctx._right)),
      ctx
    );
  };
  visitSEUnaryMinus: (ctx: SEUnaryMinusContext) => Expr<any> = (ctx) => {
    return this.associateContextAndReturn(
      new UnaryMinusExpr(this.visit(ctx.singleExpr())),
      ctx
    );
  };

  /*================================================
   * BooleanExpr
   *===============================================*/

  visitSEBooleanBinaryOp: (ctx: SEBooleanBinaryOpContext) => Expr<any> = (
    ctx
  ) => {
    switch (ctx._op.text) {
      case "&&":
        return this.associateContextAndReturn(
          new AndExpr(
            this.visit(ctx.singleExpr(0)),
            this.visit(ctx.singleExpr(1))
          ),
          ctx
        );
      case "||":
        return this.associateContextAndReturn(
          new OrExpr(
            this.visit(ctx.singleExpr(0)),
            this.visit(ctx.singleExpr(1))
          ),
          ctx
        );
      case "><":
        return this.associateContextAndReturn(
          new XorExpr(
            this.visit(ctx.singleExpr(0)),
            this.visit(ctx.singleExpr(1))
          ),
          ctx
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
    return this.associateContextAndReturn(
      new BooleanLiteralExpr(ctx.BOOLEAN().getText().toUpperCase() === "TRUE"),
      ctx
    );
  };

  visitLogicalLiteral: (ctx: LogicalLiteralContext) => Expr<any> = (ctx) => {
    // the only literal we recognize is 'UNKNOWN' (true and false are boolean literals)
    return this.associateContextAndReturn(
      new LogicalLiteralExpr(LogicalValue.UNKNOWN_VALUE),
      ctx
    );
  };

  visitSENot: (ctx: SENotContext) => Expr<any> = (ctx) => {
    return this.associateContextAndReturn(
      new NotExpr(this.visit(ctx.singleExpr())),
      ctx
    );
  };

  /*================================================
   * ArrayExpr
   *===============================================*/

  visitArrayExpr: (ctx: ArrayExprContext) => Expr<any> = (ctx) => {
    return this.associateContextAndReturn(
      new ArrayExpr(this.collectArrayElements(ctx.arrayElementList())),
      ctx
    );
  };

  collectArrayElements: (ctx: ArrayElementListContext) => Array<Expr<any>> = (
    ctx
  ) => {
    if (!isNullish(ctx)) {
      const first = this.visit(ctx.singleExpr());
      const rest = ctx.arrayElementList();
      if (!isNullish(rest)) {
        const arr = this.collectArrayElements(rest);
        arr.unshift(first);
        return arr;
      }
      return [first];
    }
    return [];
  };

  /*================================================
   * FuncExpr
   *===============================================*/

  visitFunctionCall: (ctx: FunctionCallContext) => Expr<any> = (ctx) => {
    const args = isNullish(ctx.exprList())
      ? []
      : this.collectFunctionArguments(ctx.exprList());
    return this.associateContextAndReturn(
      new FunctionExpr(ctx.IDENTIFIER().getText(), args),
      ctx
    );
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
