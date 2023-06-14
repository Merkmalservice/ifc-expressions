import {MmsExpression} from "../src/MmsExpression";
import Decimal from "decimal.js";


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
("mmsExpression", (input: string, result:any) => {
    it(`evaluate("${input}") = ${result}`, () => {
        const result = MmsExpression.evaluate(input);
        expect(result).toStrictEqual(result);
    });
})

describe("mmsExpression", () => {
    it(".evaluate() throws SyntaxErrorException", () => {
       expect(() => MmsExpression.evaluate("1+")).toThrow();
    })
    it(".parse() does not throw SyntaxErrorException", () => {
        expect(() => MmsExpression.parse("1+")).not.toThrow();
    })
})