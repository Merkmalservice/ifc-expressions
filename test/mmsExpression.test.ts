import {MmsExpression} from "../src/MmsExpression";
import Decimal from "decimal.js";
import {
    MmsExpressionContext
} from "../src/context/MmsExpressionContext";
import {NumericValue} from "../src/context/value/NumericValue";
import {ObjectAccessor} from "../src/context/accessor/ObjectAccessor";


describe.each([
    ["1",  new Decimal("1")],
    ["1.5",new Decimal("1.5")],
    ["1+1",new Decimal("2")],
    ["2*3",new Decimal("6")],
    ["6/2",new Decimal("3")],
    ["1/5",new Decimal("0.2")],
    ["2*2+1",new Decimal("5")],
    ["1+2*2",new Decimal("5")],
    ["(1+2)*2",new Decimal("6")],
    ["(1+(2)*2)",new Decimal("5")],

])
("mmsExpression (numeric, no context)", (input: string, result:any) => {
    it(`evaluate("${input}") = ${result}`, () => {
        const actualResult = MmsExpression.evaluate(input, {} as unknown as MmsExpressionContext);
        expect((actualResult as NumericValue).getValue()).toStrictEqual(result);
    } );
})

describe.each( [
        ["prop@value",new Decimal(1), {
            resolvePropRef: () => ({
                getAttribute :  (s) => new NumericValue(new Decimal(1))
            }) as unknown as ObjectAccessor
        } as unknown as MmsExpressionContext],
    ["elem.myProp1@value",new Decimal(1), {
        resolveElemRef: () => ({
            getNestedObjectAccessor: (s) => ({
                getAttribute: (s) => new NumericValue(new Decimal(1))
            }) as unknown as ObjectAccessor
        }) as unknown as ObjectAccessor
    } as unknown as MmsExpressionContext],
    ["(elem.myProp1@value + 1) * 3",new Decimal(6), {
        resolveElemRef: () => ({
            getNestedObjectAccessor: (s) => ({
                getAttribute: (s) => new NumericValue(new Decimal(1))
            }) as unknown as ObjectAccessor
        }) as unknown as ObjectAccessor
    } as unknown as MmsExpressionContext],
    ])("mmsExpression (with context)", (input:string, result: any, context:any) => {
    it (`evaluate("${input}", ctx) = ${result}`, () => {
        const actualResult = MmsExpression.evaluate(input, context);
        expect((actualResult as NumericValue).getValue()).toStrictEqual(result);
    })
})



describe("mmsExpression", () => {
    it(".evaluate(ctx) throws SyntaxErrorException", () => {
       expect(() => MmsExpression.evaluate("1+", {} as unknown as MmsExpressionContext)).toThrow();
    })
    it(".parse() does not throw SyntaxErrorException", () => {
        expect(() => MmsExpression.parse("1+")).not.toThrow();
    })
})