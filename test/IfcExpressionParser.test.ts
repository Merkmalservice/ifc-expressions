import { IfcExpressionErrorListener } from "../src/IfcExpressionErrorListener.js";
import { IfcExpression, isPresent } from "../src/IfcExpression.js";
import IfcExpressionLexer from "../src/gen/parser/IfcExpressionLexer.js";
import IfcExpressionParser from "../src/gen/parser/IfcExpressionParser.js";
import { CharStream, CommonTokenStream } from "antlr4";
import { SyntaxErrorException } from "../src/error/SyntaxErrorException.js";
import { NoSuchFunctionException } from "../src/error/NoSuchFunctionException.js";
import { InvalidSyntaxException } from "../src/error/InvalidSyntaxException.js";
import { NoSuchMethodException } from "../src/error/NoSuchMethodException.js";

describe.each([
  ["+1", SyntaxErrorException],
  ["(1)", null],
  ["((1))", null],
  ["((1))", null],
  ['"1"', null],
  ["1+1", null],
  ["+1+1", SyntaxErrorException],
  ["-1+1", null],
  ["1.1+1", null],
  ["-0+1", null],
  ["-*1+1", SyntaxErrorException],
  ["+-1+1", SyntaxErrorException],
  ["-+1+1", SyntaxErrorException],
  ["FUNC()", NoSuchFunctionException],
  ["FUNC(1)", NoSuchFunctionException],
  ["FUNC(1,1)", NoSuchFunctionException],
  ['FUNC("1")', NoSuchFunctionException],
  ['FUNC("1","1")', NoSuchFunctionException],
  ["'1'", null],
  ['"1"', null],
  ["\"ab\" + 'cd'", null],
  ["a", SyntaxErrorException],
  ["1func(1)", SyntaxErrorException],
  ["_func(1)", NoSuchFunctionException],
  ["- func(1)", NoSuchFunctionException],
  ["-func(1)", NoSuchFunctionException],
  ["--func(1)", InvalidSyntaxException],
  ["-+func(1)", SyntaxErrorException],
  ["&func(1)", SyntaxErrorException],
  ["fu_nc(1)", NoSuchFunctionException],
  ["fu-nc(1)", NoSuchFunctionException],
  ["fu1nc(1)", NoSuchFunctionException],
  ["fu&nc(1)", NoSuchFunctionException],
  ["0.0", null],
  ["0,0", SyntaxErrorException],
  ["0.0,1", SyntaxErrorException],
  ["0.0.0", SyntaxErrorException],
  ["1.0E07", SyntaxErrorException],
  ["-0", null],
  ["+0", SyntaxErrorException],
  ["1+(-1)", null],
  // Single expressions
  ["attributeRef", SyntaxErrorException],
  ["ROUND(1.1234,2)", null],
  ["round(1.1234,2)", null],
  ["RouNd(1.1234,2)", null],

  ["123", null],
  [
    "123456789123456789123456789123456789123456789123456789123456789123456789",
    null,
  ],
  ["1.23", null],
  ["['a', 'b', 'c']", null],
  ["'Hello, world!'", null],

  // Numerical expressions
  ["2 * 3", null],
  ["5 / 2", null],
  ["10 + 7", null],
  ["8 - 4", null],
  ["-42", null],
  ["3.14", null],
  ["(6 * 9)", null],

  // boolean expressions
  ["TRUE && FALSE", null],
  ["(TRUE||FALSE) && TRUE", null],
  ["TRUE.and(FALSE)", null],
  ["False.not()", null],
  ["AND(TRUE, FALSE)", null],
  ["TRUE && FALSE ^ FALSE", null],
  ["TRUE.implies(TRUE)", null],

  // String expressions
  ["'Quoted string'", null],
  ["'Hello' + ' ' + 'world'", null],

  // Object reference
  ["$element", null],
  ["$property", null],
  ["$element.ifcClass()", null],
  ["$element.name()", null],
  ["$element.description()", null],
  ["$element.guid()", null],
  ["$property.ifcClass()", null],
  ["$property.name()", null],
  ["$property.description()", null],
  ["$property.propertySet()", null],
  ["$element.propertySet('propertySetName')", null],
  ["$element.propertySet('propertySetName')", null],
  // Function calls with arguments

  // Array expressions
  ["[]", null],
  ["[1, 2, 3]", null],
  ["[ROUND(1.23), 'string', $property.name()]", null],
  ["[[1, 2], [3, 4]]", null],

  //comparisons
  ["1==1", null],
  ["2>1", null],
    ["3==3 && 'ab' > 'cde'", null]

])("Parse IfcExpression", (input: string, expectedException: any) => {
  it(`parse("${input}"): ${
    expectedException === null ? "ok" : expectedException.name
  }`, () => {
    const errorListener = new IfcExpressionErrorListener();
    const expr = IfcExpression.parse(input, errorListener);
    if (expectedException === null) {
      expect(errorListener.getException()).toBe(undefined);
    } else {
      const actualException = errorListener.getException();
      const className = actualException.constructor.name;
      expect(className).toBe(expectedException.name);
    }
  });
});
