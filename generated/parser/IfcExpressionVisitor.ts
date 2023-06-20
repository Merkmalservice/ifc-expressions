// Generated from IfcExpression.g4 by ANTLR 4.13.0

import { ParseTreeVisitor } from "antlr4";

import { ExprContext } from "./IfcExpressionParser";
import { NumMulDivContext } from "./IfcExpressionParser";
import { NumAddSubContext } from "./IfcExpressionParser";
import { NumParensContext } from "./IfcExpressionParser";
import { NumLitContext } from "./IfcExpressionParser";
import { NumFunCallContext } from "./IfcExpressionParser";
import { NumAttributeRefContext } from "./IfcExpressionParser";
import { NumLiteralContext } from "./IfcExpressionParser";
import { StringAttributeRefContext } from "./IfcExpressionParser";
import { StringLiteralContext } from "./IfcExpressionParser";
import { StringFunCallContext } from "./IfcExpressionParser";
import { StringConcatContext } from "./IfcExpressionParser";
import { ObjectRefContext } from "./IfcExpressionParser";
import { AttributeRefContext } from "./IfcExpressionParser";
import { NestedObjectChainInnerContext } from "./IfcExpressionParser";
import { NestedObjectChainEndContext } from "./IfcExpressionParser";
import { NamedRefContext } from "./IfcExpressionParser";
import { FunctionCallContext } from "./IfcExpressionParser";
import { ExprListContext } from "./IfcExpressionParser";
import { ArrayContext } from "./IfcExpressionParser";
import { ArrayElementListContext } from "./IfcExpressionParser";

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `IfcExpressionParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class IfcExpressionVisitor<
  Result
> extends ParseTreeVisitor<Result> {
  /**
   * Visit a parse tree produced by `IfcExpressionParser.expr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExpr?: (ctx: ExprContext) => Result;
  /**
   * Visit a parse tree produced by the `numMulDiv`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumMulDiv?: (ctx: NumMulDivContext) => Result;
  /**
   * Visit a parse tree produced by the `numAddSub`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumAddSub?: (ctx: NumAddSubContext) => Result;
  /**
   * Visit a parse tree produced by the `numParens`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumParens?: (ctx: NumParensContext) => Result;
  /**
   * Visit a parse tree produced by the `numLit`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumLit?: (ctx: NumLitContext) => Result;
  /**
   * Visit a parse tree produced by the `numFunCall`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumFunCall?: (ctx: NumFunCallContext) => Result;
  /**
   * Visit a parse tree produced by the `numAttributeRef`
   * labeled alternative in `IfcExpressionParser.numExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumAttributeRef?: (ctx: NumAttributeRefContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.numLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumLiteral?: (ctx: NumLiteralContext) => Result;
  /**
   * Visit a parse tree produced by the `stringAttributeRef`
   * labeled alternative in `IfcExpressionParser.stringExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStringAttributeRef?: (ctx: StringAttributeRefContext) => Result;
  /**
   * Visit a parse tree produced by the `stringLiteral`
   * labeled alternative in `IfcExpressionParser.stringExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStringLiteral?: (ctx: StringLiteralContext) => Result;
  /**
   * Visit a parse tree produced by the `stringFunCall`
   * labeled alternative in `IfcExpressionParser.stringExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStringFunCall?: (ctx: StringFunCallContext) => Result;
  /**
   * Visit a parse tree produced by the `stringConcat`
   * labeled alternative in `IfcExpressionParser.stringExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStringConcat?: (ctx: StringConcatContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.objectRef`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitObjectRef?: (ctx: ObjectRefContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.attributeRef`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAttributeRef?: (ctx: AttributeRefContext) => Result;
  /**
   * Visit a parse tree produced by the `nestedObjectChainInner`
   * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNestedObjectChainInner?: (ctx: NestedObjectChainInnerContext) => Result;
  /**
   * Visit a parse tree produced by the `nestedObjectChainEnd`
   * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNestedObjectChainEnd?: (ctx: NestedObjectChainEndContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.namedRef`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNamedRef?: (ctx: NamedRefContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.functionCall`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFunctionCall?: (ctx: FunctionCallContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.exprList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExprList?: (ctx: ExprListContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.array`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArray?: (ctx: ArrayContext) => Result;
  /**
   * Visit a parse tree produced by `IfcExpressionParser.arrayElementList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArrayElementList?: (ctx: ArrayElementListContext) => Result;
}
