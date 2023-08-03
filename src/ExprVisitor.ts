import IfcExpressionVisitor from "./gen/parser/IfcExpressionVisitor.js";
import {NumericLiteralExpr} from "./expression/numeric/NumericLiteralExpr.js";
import {
  ArrayElementListContext,
  ArrayExprContext,
  BooleanExprBinaryOpContext,
  BooleanExprFunctionCallContext,
  BooleanExprLiteralContext,
  BooleanExprMethodCallContext,
  BooleanExprNotContext,
  BooleanExprParensContext,
  BooleanExprVariableRefContext,
  BooleanMethodCallContext,
  ExprContext,
  ExprListContext,
  FunctionCallContext,
  MethodCallChainEndContext,
  MethodCallChainInnerContext,
  NumAddSubContext,
  NumericMethodCallContext,
  NumFunCallContext,
  NumLitContext,
  NumLiteralContext,
  NumMethodCallContext,
  NumMulDivContext,
  NumParensContext,
  NumPowContext,
  NumUnaryMinusContext,
  NumUnaryMultipleMinusContext,
  NumVariableRefContext,
  SEConcatContext,
  SEFunCallContext,
  SELiteralContext,
  SEParensContext,
  SEStringMethodCallContext,
  SEVariableRefContext,
  SingleExprArrayExprContext,
  SingleExprBooleanExprContext,
  SingleExprFunctionCallContext,
  SingleExprMethodCallContext,
  SingleExprNumExprContext,
  SingleExprStringExprContext,
  SingleExprVariableRefContext,
  StringMethodCallContext,
  VariableRefContext,
} from "./gen/parser/IfcExpressionParser.js";
import {Expr} from "./expression/Expr.js";
import {isNullish, isPresent} from "./IfcExpressionUtils.js";
import Decimal from "decimal.js";
import {PlusExpr} from "./expression/numeric/PlusExpr.js";
import {MinusExpr} from "./expression/numeric/MinusExpr.js";
import {ParserRuleContext} from "antlr4";
import {MultiplyExpr} from "./expression/numeric/MultiplyExpr.js";
import {DivideExpr} from "./expression/numeric/DivideExpr.js";
import {PropObjectReferenceExpr} from "./expression/reference/PropObjectReferenceExpr.js";
import {ElemObjectReferenceExpr} from "./expression/reference/ElemObjectReferenceExpr.js";
import {StringLiteralExpr} from "./expression/string/StringLiteralExpr.js";
import {StringConcatExpr} from "./expression/string/StringConcatExpr.js";
import {ArrayExpr} from "./expression/structure/ArrayExpr.js";
import {FunctionExpr} from "./expression/function/FunctionExpr.js";
import {PowerExpr} from "./expression/numeric/PowerExpr.js";
import {UnaryMinusExpr} from "./expression/numeric/UnaryMinusExpr.js";
import {AndExpr} from "./expression/boolean/AndExpr";
import {BooleanLiteralExpr} from "./expression/boolean/BooleanLiteralExpr";
import {OrExpr} from "./expression/boolean/OrExpr";
import {XorExpr} from "./expression/boolean/XorExpr";
import {SyntaxErrorException} from "./error/SyntaxErrorException";
import {NotExpr} from "./expression/boolean/NotExpr";
import {ParenthesisExpr} from "./expression/structure/ParenthesisExpr";

export class ExprVisitor extends IfcExpressionVisitor<Expr<any>> {
  private readonly stack = [];

  constructor() {
    super();
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

  visitSingleExprMethodCall: (ctx: SingleExprMethodCallContext) => Expr<any> = (
    ctx
  ) => {
    this.stack.push(this.visit(ctx.singleExpr()));
    return this.visit(ctx.methodCallChain());
  };

  visitSingleExprVariableRef: (ctx: SingleExprVariableRefContext) => Expr<any> =
    (ctx) => {
      return this.visit(ctx.variableRef());
    };
  visitSingleExprNumExpr: (ctx: SingleExprNumExprContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.numExpr());
  };
  visitSingleExprStringExpr: (ctx: SingleExprStringExprContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.stringExpr());
  };
  visitSingleExprArrayExpr: (ctx: SingleExprArrayExprContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.arrayExpr());
  };
  visitSingleExprFunctionCall: (
    ctx: SingleExprFunctionCallContext
  ) => Expr<any> = (ctx) => {
    return this.visit(ctx.functionCall());
  };
  visitSingleExprBooleanExpr: (ctx: SingleExprBooleanExprContext) => Expr<any> =
    (ctx) => {
      return this.visit(ctx.booleanExpr());
    };

  /*================================================
   * MethodCallChain
   *==============================================*/

  visitMethodCallChainInner: (ctx: MethodCallChainInnerContext) => Expr<any> = (
    ctx
  ) => {
    this.stack.push(
      new FunctionExpr(
        ctx.functionCall().IDENTIFIER().getText(),
        this.collectFunctionArguments(ctx.functionCall().exprList(), [
          this.stack.pop(),
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
        this.stack.pop(),
      ])
    );
  };

  private stripBrackets(name: string) {
    if (name.startsWith("{")) {
      return name.substring(1, name.length - 1);
    }
    return name;
  }

  /*================================================
   * StringExpr
   *===============================================*/

  visitSELiteral: (ctx: SELiteralContext) => Expr<any> = (ctx) => {
    const quotedString = ctx.QUOTED_STRING().getText();
    const text = quotedString.substring(1, quotedString.length - 1);
    return new StringLiteralExpr(text);
  };

  visitSEParens: (ctx: SEParensContext) => Expr<any> = (ctx) => {
    return new ParenthesisExpr(this.visit(ctx.getChild(0)));
  };

  visitSEConcat: (ctx: SEConcatContext) => Expr<any> = (ctx) => {
    return new StringConcatExpr(this.visit(ctx._left), this.visit(ctx._right));
  };

  visitSEStringMethodCall: (ctx: SEStringMethodCallContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.stringMethodCall());
  };

  visitStringMethodCall: (ctx: StringMethodCallContext) => Expr<any> = (
    ctx
  ) => {
    this.stack.push(this.visit(ctx.getChild(0)));
    return this.visit(ctx.methodCallChain());
  };

  visitSEFunCall: (ctx: SEFunCallContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.functionCall());
  };

  visitSEVariableRef: (ctx: SEVariableRefContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.variableRef());
  };

  /*================================================
   * NumExpr
   *===============================================*/

  visitNumMethodCall: (ctx: NumMethodCallContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.numericMethodCall());
  };

  visitNumericMethodCall: (ctx: NumericMethodCallContext) => Expr<any> = (
    ctx
  ) => {
    this.stack.push(this.visit(ctx.getChild(0)));
    return this.visit(ctx.methodCallChain());
  };

  visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = (ctx) => {
    let val = ctx.INT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(new Decimal(ctx.getText()));
    }
    val = ctx.FLOAT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(new Decimal(ctx.getText()));
    }
    this.failNode(ctx);
  };

  visitNumAddSub: (ctx: NumAddSubContext) => Expr<any> = (ctx) => {
    switch (ctx._op.text) {
      case "+":
        return new PlusExpr(
          this.visit(ctx.getChild(0)),
          this.visit(ctx.getChild(2))
        );
      case "-":
        return new MinusExpr(
          this.visit(ctx.getChild(0)),
          this.visit(ctx.getChild(2))
        );
      default:
        this.failNode(ctx);
    }
  };

  visitNumMulDiv: (ctx: NumMulDivContext) => Expr<any> = (ctx) => {
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
        this.failNode(ctx);
    }
  };

  visitNumParens: (ctx: NumParensContext) => Expr<any> = (ctx) => {
    return new ParenthesisExpr(this.visit(ctx.getChild(1)));
  };

  visitNumLit: (ctx: NumLitContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.getChild(0));
  };

  visitNumUnaryMultipleMinus: (ctx: NumUnaryMultipleMinusContext) => Expr<any> =
    (ctx) => {
      return this.visit(ctx.numExpr());
    };
  visitNumVariableRef: (ctx: NumVariableRefContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.variableRef());
  };
  visitNumFunCall: (ctx: NumFunCallContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.functionCall());
  };
  visitNumPow: (ctx: NumPowContext) => Expr<any> = (ctx) => {
    return new PowerExpr(
      this.visit(ctx.getChild(0)),
      this.visit(ctx.getChild(1))
    );
  };
  visitNumUnaryMinus: (ctx: NumUnaryMinusContext) => Expr<any> = (ctx) => {
    return new UnaryMinusExpr(this.visit(ctx.numExpr()));
  };

  /*================================================
   * BooleanExpr
   *===============================================*/

  visitBooleanExprMethodCall: (ctx: BooleanExprMethodCallContext) => Expr<any> = ctx => {
    return this.visit(ctx.booleanMethodCall());
  }
  visitBooleanExprFunctionCall: (ctx: BooleanExprFunctionCallContext) => Expr<any> = ctx => {
    return this.visit(ctx.functionCall());
  }

  visitBooleanExprParens: (ctx: BooleanExprParensContext) => Expr<any> = ctx => {
    return new ParenthesisExpr( this.visit(ctx.booleanExpr()));
  }

  visitBooleanExprVariableRef: (ctx: BooleanExprVariableRefContext) => Expr<any> = ctx => {
    return this.visit(ctx.variableRef());
  }

  visitBooleanExprBinaryOp: (ctx: BooleanExprBinaryOpContext) => Expr<any> = ctx => {
    switch (ctx._op.text) {
      case "&&": return new AndExpr(this.visit(ctx.booleanExpr(0)), this.visit(ctx.booleanExpr(1)));
      case "||": return new OrExpr(this.visit(ctx.booleanExpr(0)), this.visit(ctx.booleanExpr(1)));
      case "^": return new XorExpr(this.visit(ctx.booleanExpr(0)), this.visit(ctx.booleanExpr(1)));
    }
    throw new SyntaxErrorException(ctx._op.text, ctx._op.line, ctx._op.column, `Unknown boolean operator ${ctx._op.text}`);
  }

  visitBooleanExprLiteral: (ctx: BooleanExprLiteralContext) => Expr<any> = ctx => {
    return new BooleanLiteralExpr(ctx.BOOLEAN().getText().toUpperCase() === 'TRUE');
  }

  visitBooleanExprNot: (ctx: BooleanExprNotContext) => Expr<any> = ctx => {
    return new NotExpr(this.visit(ctx.booleanExpr()));
  }

  visitBooleanMethodCall: (ctx: BooleanMethodCallContext) => Expr<any> = ctx => {
    this.stack.push(this.visit(ctx.getChild(0)));
    return this.visit(ctx.methodCallChain());
  }

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

  private failNode(ctx: ParserRuleContext) {
    throw new Error(`Cannot parse (sub)expression ${ctx.getText()}`);
  }
}
