import IfcExpressionVisitor from "./gen/parser/IfcExpressionVisitor.js";
import {NumericLiteralExpr} from "./expression/numeric/NumericLiteralExpr.js";
import {
    AttributeRefContext,
    ExprContext,
    NestedObjectChainEndContext,
    NestedObjectChainInnerContext,
    NumAddSubContext,
    NumAttributeRefContext,
    NumLitContext,
    NumLiteralContext,
    NumMulDivContext,
    NumParensContext,
    ObjectRefContext,
    StringAttributeRefContext,
    StringConcatContext,
    StringLiteralContext,
} from "./gen/parser/IfcExpressionParser.js";
import {Expr} from "./expression/Expr.js";
import {isPresent} from "./IfcExpressionUtils.js";
import Decimal from "decimal.js";
import {PlusExpr} from "./expression/numeric/PlusExpr.js";
import {MinusExpr} from "./expression/numeric/MinusExpr.js";
import {ParserRuleContext} from "antlr4";
import {MultiplyExpr} from "./expression/numeric/MultiplyExpr.js";
import {DivideExpr} from "./expression/numeric/DivideExpr.js";
import {NumParenthesisExpr} from "./expression/numeric/NumParenthesisExpr.js";
import {AttributeReferenceExpr} from "./expression/reference/AttributeReferenceExpr.js";
import {PropObjectReferenceExpr} from "./expression/reference/PropObjectReferenceExpr.js";
import {ElemObjectReferenceExpr} from "./expression/reference/ElemObjectReferenceExpr.js";
import {NestedObjectChainExpr} from "./expression/reference/NestedObjectChainExpr.js";
import {NestedObjectChainEndExpr} from "./expression/reference/NestedObjectChainEndExpr.js";
import {NumericValue} from "./value/NumericValue.js";
import {StringValue} from "./value/StringValue.js";
import {StringLiteralExpr} from "./expression/string/StringLiteralExpr.js";
import {StringConcatExpr} from "./expression/string/StringConcatExpr.js";

export class ExprVisitor extends IfcExpressionVisitor<Expr<any>> {
  constructor() {
    super();
  }

  /*================================================
   * AttributeRef
   *==============================================*/

  visitAttributeRef: (ctx: AttributeRefContext) => Expr<any> = (ctx) => {
    const objectRefExpr = this.visit(ctx.objectRef());
    const nestedObjectChainExpr = this.visit(ctx.nestedObjectChain());
    return new AttributeReferenceExpr(
      objectRefExpr,
      nestedObjectChainExpr as NestedObjectChainExpr
    );
  };

  visitObjectRef: (ctx: ObjectRefContext) => Expr<any> = (ctx) => {
    if (isPresent(ctx.PROP())) {
      return new PropObjectReferenceExpr();
    } else if (isPresent(ctx.ELEM())) {
      return new ElemObjectReferenceExpr();
    }
    this.failNode(ctx);
  };

  visitNestedObjectChainInner: (
    ctx: NestedObjectChainInnerContext
  ) => Expr<any> = (ctx) => {
    let name = ctx.namedRef().getChild(0).getText();
    name = this.stripBrackets(name);
    return new NestedObjectChainExpr(
      name,
      this.visit(ctx.nestedObjectChain()) as NestedObjectChainExpr
    );
  };

  visitNestedObjectChainEnd: (ctx: NestedObjectChainEndContext) => Expr<any> = (
    ctx
  ) => {
    let name = ctx.RESERVED_ATTRIBUTE_NAME().getText();
    return new NestedObjectChainEndExpr(name);
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

  visitStringLiteral: (ctx: StringLiteralContext) => Expr<any> = (ctx) => {
    const quotedString = ctx.QUOTED_STRING().getText();
    const text = quotedString.substring(1, quotedString.length - 1);
    return new StringLiteralExpr(new StringValue(text));
  };

  visitStringAttributeRef: (ctx: StringAttributeRefContext) => Expr<any> = (
    ctx
  ) => {
    return this.visit(ctx.getChild(0));
  };

  visitStringConcat: (ctx: StringConcatContext) => Expr<any> = (ctx) => {
    return new StringConcatExpr(this.visit(ctx._left), this.visit(ctx._right));
  };

  /*================================================
   * NumExpr
   *===============================================*/

  visitNumAttributeRef: (ctx: NumAttributeRefContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.getChild(0));
  };

  visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = (ctx) => {
    let val = ctx.INT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(
        new NumericValue(new Decimal(val.symbol.text))
      );
    }
    val = ctx.FLOAT();
    if (isPresent(val)) {
      return new NumericLiteralExpr(
        new NumericValue(new Decimal(val.symbol.text))
      );
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
    return new NumParenthesisExpr(this.visit(ctx.getChild(1)));
  };

  visitExpr: (ctx: ExprContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.getChild(0));
  };

  visitNumLit: (ctx: NumLitContext) => Expr<any> = (ctx) => {
    return this.visit(ctx.getChild(0));
  };

  private failNode(ctx: ParserRuleContext) {
    throw new Error(`Cannot parse (sub)expression ${ctx.getText()}`);
  }
}
