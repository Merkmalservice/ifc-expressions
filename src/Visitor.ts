import MmsExpressionVisitor from "../generated/parser/MmsExpressionVisitor";
import { NumericLiteralExpr } from "./expression/numeric/NumericLiteralExpr";
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
} from "../generated/parser/MmsExpressionParser";
import { Expr } from "./expression/Expr";
import {notNullish, nullish} from "./utils";
import Decimal from "decimal.js";
import { PlusExpr } from "./expression/numeric/PlusExpr";
import { MinusExpr } from "./expression/numeric/MinusExpr";
import { ParserRuleContext } from "antlr4";
import { MultiplyExpr } from "./expression/numeric/MultiplyExpr";
import { DivideExpr } from "./expression/numeric/DivideExpr";
import { NumParenthesisExpr } from "./expression/numeric/NumParenthesisExpr";
import {AttributeReferenceExpr} from "./expression/reference/AttributeReferenceExpr";
import {PropObjectReferenceExpr} from "./expression/reference/PropObjectReferenceExpr";
import {ElemObjectReferenceExpr} from "./expression/reference/ElemObjectReferenceExpr";
import {NestedObjectChainExpr} from "./expression/reference/NestedObjectChainExpr";
import {NestedObjectChainEndExpr} from "./expression/reference/NestedObjectChainEndExpr";
import {NumericValue} from "./context/value/NumericValue";

export class Visitor extends MmsExpressionVisitor<Expr<any>> {
  private head: Expr<any> = undefined;

  constructor() {
    super();
  }

  /*================================================
   * AttributeRef
   *==============================================*/



  visitAttributeRef: (ctx: AttributeRefContext) => Expr<any> = (ctx) => {
    const objectRefExpr = this.visit(ctx.objectRef());
    const nestedObjectChainExpr = this.visit(ctx.nestedObjectChain());
    return new AttributeReferenceExpr(objectRefExpr, nestedObjectChainExpr as NestedObjectChainExpr);
  }

  visitObjectRef: (ctx: ObjectRefContext) => Expr<any> = ctx => {
    if (notNullish(ctx.PROP())){
      return new PropObjectReferenceExpr();
    } else if (notNullish(ctx.ELEM())){
      return new ElemObjectReferenceExpr();
    }
    this.failNode(ctx);
  }


  visitNestedObjectChainInner: (ctx: NestedObjectChainInnerContext) => Expr<any> = ctx => {
    let name = ctx.namedRef().getChild(0).getText();
    name = this.stripBrackets(name);
    return new NestedObjectChainExpr(name, this.visit(ctx.nestedObjectChain()) as NestedObjectChainExpr);
  };

  visitNestedObjectChainEnd: (ctx: NestedObjectChainEndContext) => Expr<any> = ctx => {
    let name = ctx.RESERVED_ATTRIBUTE_NAME().getText();
    return new NestedObjectChainEndExpr(name);
  };

  private stripBrackets(name: string) {
    if (name.startsWith('{')) {
      return name.substring(1, name.length - 1);
    }
    return name;
  }


  /*================================================
   * NumExpr
   *===============================================*/

  visitNumAttributeRef: (ctx: NumAttributeRefContext) => Expr<any> = ctx => {
    return this.visit(ctx.getChild(0));
  };


  visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = (ctx) => {
    let val = ctx.INT();
    if (notNullish(val)) {
      return new NumericLiteralExpr(
        new NumericValue(new Decimal(val.symbol.text))
      );
    }
    val = ctx.FLOAT();
    if (notNullish(val)) {
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
