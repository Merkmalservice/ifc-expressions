// Generated from IfcExpression.g4 by ANTLR 4.13.0

import {ParseTreeListener} from "antlr4";


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
 * This interface defines a complete listener for a parse tree produced by
 * `IfcExpressionParser`.
 */
export default class IfcExpressionListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;
	/**
	 * Enter a parse tree produced by the `numMulDiv`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumMulDiv?: (ctx: NumMulDivContext) => void;
	/**
	 * Exit a parse tree produced by the `numMulDiv`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumMulDiv?: (ctx: NumMulDivContext) => void;
	/**
	 * Enter a parse tree produced by the `numAddSub`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumAddSub?: (ctx: NumAddSubContext) => void;
	/**
	 * Exit a parse tree produced by the `numAddSub`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumAddSub?: (ctx: NumAddSubContext) => void;
	/**
	 * Enter a parse tree produced by the `numParens`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumParens?: (ctx: NumParensContext) => void;
	/**
	 * Exit a parse tree produced by the `numParens`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumParens?: (ctx: NumParensContext) => void;
	/**
	 * Enter a parse tree produced by the `numLit`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumLit?: (ctx: NumLitContext) => void;
	/**
	 * Exit a parse tree produced by the `numLit`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumLit?: (ctx: NumLitContext) => void;
	/**
	 * Enter a parse tree produced by the `numFunCall`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumFunCall?: (ctx: NumFunCallContext) => void;
	/**
	 * Exit a parse tree produced by the `numFunCall`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumFunCall?: (ctx: NumFunCallContext) => void;
	/**
	 * Enter a parse tree produced by the `numAttributeRef`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	enterNumAttributeRef?: (ctx: NumAttributeRefContext) => void;
	/**
	 * Exit a parse tree produced by the `numAttributeRef`
	 * labeled alternative in `IfcExpressionParser.numExpr`.
	 * @param ctx the parse tree
	 */
	exitNumAttributeRef?: (ctx: NumAttributeRefContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.numLiteral`.
	 * @param ctx the parse tree
	 */
	enterNumLiteral?: (ctx: NumLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.numLiteral`.
	 * @param ctx the parse tree
	 */
	exitNumLiteral?: (ctx: NumLiteralContext) => void;
	/**
	 * Enter a parse tree produced by the `stringAttributeRef`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringAttributeRef?: (ctx: StringAttributeRefContext) => void;
	/**
	 * Exit a parse tree produced by the `stringAttributeRef`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringAttributeRef?: (ctx: StringAttributeRefContext) => void;
	/**
	 * Enter a parse tree produced by the `stringLiteral`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringLiteral?: (ctx: StringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `stringLiteral`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringLiteral?: (ctx: StringLiteralContext) => void;
	/**
	 * Enter a parse tree produced by the `stringFunCall`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringFunCall?: (ctx: StringFunCallContext) => void;
	/**
	 * Exit a parse tree produced by the `stringFunCall`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringFunCall?: (ctx: StringFunCallContext) => void;
	/**
	 * Enter a parse tree produced by the `stringConcat`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringConcat?: (ctx: StringConcatContext) => void;
	/**
	 * Exit a parse tree produced by the `stringConcat`
	 * labeled alternative in `IfcExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringConcat?: (ctx: StringConcatContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.objectRef`.
	 * @param ctx the parse tree
	 */
	enterObjectRef?: (ctx: ObjectRefContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.objectRef`.
	 * @param ctx the parse tree
	 */
	exitObjectRef?: (ctx: ObjectRefContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.attributeRef`.
	 * @param ctx the parse tree
	 */
	enterAttributeRef?: (ctx: AttributeRefContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.attributeRef`.
	 * @param ctx the parse tree
	 */
	exitAttributeRef?: (ctx: AttributeRefContext) => void;
	/**
	 * Enter a parse tree produced by the `nestedObjectChainInner`
	 * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
	 * @param ctx the parse tree
	 */
	enterNestedObjectChainInner?: (ctx: NestedObjectChainInnerContext) => void;
	/**
	 * Exit a parse tree produced by the `nestedObjectChainInner`
	 * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
	 * @param ctx the parse tree
	 */
	exitNestedObjectChainInner?: (ctx: NestedObjectChainInnerContext) => void;
	/**
	 * Enter a parse tree produced by the `nestedObjectChainEnd`
	 * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
	 * @param ctx the parse tree
	 */
	enterNestedObjectChainEnd?: (ctx: NestedObjectChainEndContext) => void;
	/**
	 * Exit a parse tree produced by the `nestedObjectChainEnd`
	 * labeled alternative in `IfcExpressionParser.nestedObjectChain`.
	 * @param ctx the parse tree
	 */
	exitNestedObjectChainEnd?: (ctx: NestedObjectChainEndContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.namedRef`.
	 * @param ctx the parse tree
	 */
	enterNamedRef?: (ctx: NamedRefContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.namedRef`.
	 * @param ctx the parse tree
	 */
	exitNamedRef?: (ctx: NamedRefContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.exprList`.
	 * @param ctx the parse tree
	 */
	enterExprList?: (ctx: ExprListContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.exprList`.
	 * @param ctx the parse tree
	 */
	exitExprList?: (ctx: ExprListContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.array`.
	 * @param ctx the parse tree
	 */
	enterArray?: (ctx: ArrayContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.array`.
	 * @param ctx the parse tree
	 */
	exitArray?: (ctx: ArrayContext) => void;
	/**
	 * Enter a parse tree produced by `IfcExpressionParser.arrayElementList`.
	 * @param ctx the parse tree
	 */
	enterArrayElementList?: (ctx: ArrayElementListContext) => void;
	/**
	 * Exit a parse tree produced by `IfcExpressionParser.arrayElementList`.
	 * @param ctx the parse tree
	 */
	exitArrayElementList?: (ctx: ArrayElementListContext) => void;
}

