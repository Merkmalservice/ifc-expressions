import {ArrayExpr} from "./expression/structure/ArrayExpr";
import {Expr} from "./expression/Expr";
import {StringConcatExpr} from "./expression/string/StringConcatExpr";
import {StringLiteralExpr} from "./expression/string/StringLiteralExpr";
import {ElemObjectReferenceExpr} from "./expression/reference/ElemObjectReferenceExpr";
import {PropObjectReferenceExpr} from "./expression/reference/PropObjectReferenceExpr";
import {NumericValue} from "./value/NumericValue";
import {DivideExpr} from "./expression/numeric/DivideExpr";
import {StringValue} from "./value/StringValue";
import {MinusExpr} from "./expression/numeric/MinusExpr";
import {MultiplyExpr} from "./expression/numeric/MultiplyExpr";
import {PlusExpr} from "./expression/numeric/PlusExpr";
import {NumericLiteralExpr} from "./expression/numeric/NumericLiteralExpr";
import { Decimal } from "decimal.js";
import {NumParenthesisExpr} from "./expression/numeric/NumParenthesisExpr";
import {ParenthesisExpr} from "./expression/structure/ParenthesisExpr";
import {PowerExpr} from "./expression/numeric/PowerExpr";
import {UnaryMinusExpr} from "./expression/numeric/UnaryMinusExpr";
import {FunctionExpr} from "./expression/function/FunctionExpr";
import {BooleanValue} from "./value/BooleanValue";
import {AndExpr} from "./expression/boolean/AndExpr";
import {OrExpr} from "./expression/boolean/OrExpr";
import {XorExpr} from "./expression/boolean/XorExpr";
import {BooleanLiteralExpr} from "./expression/boolean/BooleanLiteralExpr";
import {NotExpr} from "./expression/boolean/NotExpr";

export class E {
    public static array(...elements: Array<Expr<any>>): ArrayExpr {
        return new ArrayExpr(elements);
    }
    public static concat(left: Expr<StringValue>, right: Expr<StringValue>): StringConcatExpr {
        return new StringConcatExpr(left, right);
    }
    public static string(literal: string): StringLiteralExpr {
        return new StringLiteralExpr(literal);
    }
    public static element(){
        return new ElemObjectReferenceExpr();
    }
    public static property(){
        return new PropObjectReferenceExpr();
    }
    public static div(left: Expr<NumericValue>, right: Expr<NumericValue>): DivideExpr{
        return new DivideExpr(left, right);
    }
    public static minus(left: Expr<NumericValue>, right: Expr<NumericValue>): MinusExpr{
        return new MinusExpr(left, right);
    }
    public static multiply(left: Expr<NumericValue>, right: Expr<NumericValue>): MultiplyExpr{
        return new MultiplyExpr(left, right);
    }
    public static plus(left: Expr<NumericValue>, right: Expr<NumericValue>): PlusExpr{
        return new PlusExpr(left, right);
    }
    public static number(literal: number | string | Decimal): NumericLiteralExpr {
        return new NumericLiteralExpr(literal);
    }
    public static parenthesis(numericExpression: Expr<NumericValue>): ParenthesisExpr {
        return new ParenthesisExpr(numericExpression);
    }
    public static power(base: Expr<NumericValue>, power: Expr<NumericValue>): PowerExpr{
        return new PowerExpr(base, power);
    }
    public static unaryMinus(numExpr: Expr<NumericValue>): UnaryMinusExpr {
        return new UnaryMinusExpr(numExpr);
    }
    public static fun(functionName: string, ...funcArgs: Array<Expr<any>>): FunctionExpr {
        return new FunctionExpr(functionName, funcArgs);
    }
    public static and(left: Expr<BooleanValue>, right: Expr<BooleanValue>): AndExpr {
        return new AndExpr(left, right);
    }
    public static or(left: Expr<BooleanValue>, right: Expr<BooleanValue>): OrExpr {
        return new OrExpr(left, right);
    }
    public static xor(left: Expr<BooleanValue>, right: Expr<BooleanValue>): XorExpr {
        return new XorExpr(left, right);
    }
    public static  boolean(literal:  boolean){
        return new BooleanLiteralExpr(literal);
    }
    public static not (booleanExpr: Expr<BooleanValue>): NotExpr {
        return new NotExpr(booleanExpr);
    }
}