import { IfcExpressionErrorListener } from "../src/IfcExpressionErrorListener.js";
import { IfcExpression } from "../src/IfcExpression.js";
import { SyntaxErrorException } from "../src/error/SyntaxErrorException.js";
import { NoSuchFunctionException } from "../src/error/NoSuchFunctionException.js";
import { InvalidSyntaxException } from "../src/error/InvalidSyntaxException.js";
import { ExpressionTypeError } from "../src/error/ExpressionTypeError.js";
import { WrongFunctionArgumentTypeException } from "../src/error/WrongFunctionArgumentTypeException.js";
import { Type, Types } from "../src/type/Types.js";
import { ExprType } from "../src/type/ExprType.js";

describe.each([
  // numeric
  ["+1", SyntaxErrorException, null],
  ["(1)", null, Type.NUMERIC],
  ["((1))", null, Type.NUMERIC],
  ["((1))", null, Type.NUMERIC],
  ['"1"', null, Type.NUMERIC],
  ["1+1", null, Type.NUMERIC],
  ["+1+1", SyntaxErrorException, null],
  ["-1+1", null, Type.NUMERIC],
  ["1.1+1", null, Type.NUMERIC],
  ["-0+1", null, Type.NUMERIC],
  ["-*1+1", SyntaxErrorException, null],
  ["+-1+1", SyntaxErrorException, null],
  ["-+1+1", SyntaxErrorException, null],
  ["2 * 3", null, Type.NUMERIC],
  ["5 / 2", null, Type.NUMERIC],
  ["10 + 7", null, Type.NUMERIC],
  ["8 - 4", null, Type.NUMERIC],
  ["-42", null, Type.NUMERIC],
  ["3.14", null, Type.NUMERIC],
  ["(6 * 9)", null, Type.NUMERIC],
  ["0.0", null, Type.NUMERIC],
  ["0,0", SyntaxErrorException, null],
  ["0.0,1", SyntaxErrorException, null],
  ["0.0.0", SyntaxErrorException, null],
  ["1.0E07", SyntaxErrorException, null],
  ["-0", null, Type.NUMERIC],
  ["+0", SyntaxErrorException, null],
  ["1+(-1)", null, Type.NUMERIC],

  // functions
  ["FUNC()", NoSuchFunctionException, null],
  ["FUNC(1)", NoSuchFunctionException, null],
  ["FUNC(1,1)", NoSuchFunctionException, null],
  ['FUNC("1")', NoSuchFunctionException, null],
  ['FUNC("1","1")', NoSuchFunctionException, null],
  ["'1'", null, Type.STRING],
  ['"1"', null, Type.STRING],
  ["\"ab\" + 'cd'", null, Type.STRING],
  ["a", SyntaxErrorException, null],
  ["1func(1)", SyntaxErrorException, null],
  ["_func(1)", NoSuchFunctionException, null],
  ["- func(1)", NoSuchFunctionException, null],
  ["-func(1)", NoSuchFunctionException, null],
  ["--func(1)", InvalidSyntaxException, null],
  ["-+func(1)", SyntaxErrorException, null],
  ["&func(1)", SyntaxErrorException, null],
  ["fu_nc(1)", NoSuchFunctionException, null],
  ["fu-nc(1)", NoSuchFunctionException, null],
  ["fu1nc(1)", NoSuchFunctionException, null],
  ["fu&nc(1)", NoSuchFunctionException, null],
  ["ROUND(1.1234,2)", null, Type.NUMERIC],
  ["round(1.1234,2)", null, Type.NUMERIC],
  ["RouNd(1.1234,2)", null, Type.NUMERIC],
  // literal

  ["123", null, Type.NUMERIC],
  [
    "123456789123456789123456789123456789123456789123456789123456789123456789",
    null,
    Type.NUMERIC,
  ],
  ["1.23", null, Type.NUMERIC],
  ["['a', 'b', 'c']", null, Types.tuple(Type.STRING, Type.STRING, Type.STRING)],

  // boolean expressions
  ["TRUE && FALSE", null, Type.BOOLEAN],
  ["(TRUE||FALSE) && TRUE", null, Type.BOOLEAN],
  ["TRUE.and(FALSE)", null, Type.BOOLEAN],
  ["false.not()", null, Type.BOOLEAN],
  ["AND(TRUE, FALSE)", null, Type.BOOLEAN],
  ["TRUE && FALSE >< FALSE", null, Type.BOOLEAN],
  ["TRUE.implies(TRUE)", null, Type.BOOLEAN],

  // String expressions
  ["'Hello, world!'", null, Type.STRING],
  ["'Quoted string'", null, Type.STRING],
  ["'Hello' + ' ' + 'world'", null, Type.STRING],

  // Object reference
  ["$element", null, Type.IFC_ELEMENT_REF],
  ["$property", null, Type.IFC_PROPERTY_REF],
  ["$element.ifcClass()", null, Type.STRING],
  ["$element.name()", null, Type.STRING],
  ["$element.description()", null, Type.STRING],
  ["$element.guid()", null, Type.STRING],
  ["$property.ifcClass()", null, Type.STRING],
  ["$property.name()", null, Type.STRING],
  ["$property.description()", null, Type.STRING],
  ["$property.propertySet()", null, Type.IFC_PROPERTY_SET_REF],
  ["$element.propertySet('propertySetName')", null, Type.IFC_PROPERTY_SET_REF],
  ["$element.propertySet('propertySetName')", null, Type.IFC_PROPERTY_SET_REF],
  ["attributeRef", SyntaxErrorException, null],

  // Array expressions
  ["[]", null, Types.tuple()],
  ["[1, 2, 3]", null, Types.tuple(Type.NUMERIC, Type.NUMERIC, Type.NUMERIC)],
  [
    "[ROUND(1.23), 'string', $property.name()]",
    null,
    Types.tuple(Type.NUMERIC, Type.STRING, Type.STRING),
  ],
  [
    "[[1, 2], [3, 4]]",
    null,
    Types.tuple(
      Types.tuple(Type.NUMERIC, Type.NUMERIC),
      Types.tuple(Type.NUMERIC, Type.NUMERIC)
    ),
  ],

  // comparisons
  ["1==1", null, Type.BOOLEAN],
  ["2>1", null, Type.BOOLEAN],
  ["3==3 && 'ab' > 'cde'", null, Type.BOOLEAN],

  // type mismatch
  ['1 + "bla"', ExpressionTypeError, null],
  ['"bla" + 1', ExpressionTypeError, null],
  ["TRUE + FALSE", ExpressionTypeError, null],
  ["TRUE + 1", ExpressionTypeError, null],
  ["TRUE == 1", ExpressionTypeError, null],
  ['"bla" + TRUE', ExpressionTypeError, null],
  ['-"bla"', ExpressionTypeError, null],
  ["'bla' && 1", ExpressionTypeError, null],
  ["'bla' > TRUE", ExpressionTypeError, null],
  ["!1", ExpressionTypeError, null],
  ["! 3 + 4 == 3-2  && ! 4 > 5", null, Type.BOOLEAN],
  ["! TRUE && ! -4+-5^2>2 || FALSE", null, Type.BOOLEAN],
  ["! (3 + 4 == 3-2)  && ! (4 > 5 )", null, Type.BOOLEAN],
  ["! (3 + 4 == 3-2)  && ! (4 > $property.value() )", null, Type.BOOLEAN],
  ["ROUND('abc')", WrongFunctionArgumentTypeException, null],
  ["ROUND('abc',1)", WrongFunctionArgumentTypeException, null],
  ["ROUND($property.value())", null, Type.NUMERIC],
  ["OR('abc', TRUE)", WrongFunctionArgumentTypeException, null],
  ["OR('abc'=='def', TRUE)", null, Type.BOOLEAN],
  ["EXISTS($element.property('dontFindThis'))", null, Type.BOOLEAN],
  ["EXISTS('abc')", WrongFunctionArgumentTypeException, null],
  ["EXISTS(1)", WrongFunctionArgumentTypeException, null],
  ["EXISTS(TRUE)", WrongFunctionArgumentTypeException, null],
  [
    '1 + MAP("grün", [["rot", "red"],["grün","green"],["blau", "blue"]])',
    ExpressionTypeError,
    null,
  ],
  [
    'MAP("grün", [["rot", "red"],["grün","green"],["blau", "blue"]]) + "horn"',
    null,
    Type.STRING,
  ],
  [
    'MAP("grün", [["rot", 1],["grün",2],["blau",3]]) + "horn"',
    ExpressionTypeError,
    null,
  ],
  [
    'MAP(TRUE, [["rot", 1],["grün",2],["blau",3]])',
    WrongFunctionArgumentTypeException,
    null,
  ],
  [
    'MAP("rot", [["rot", 1],["grün",2],["blau",3]], "one")',
    WrongFunctionArgumentTypeException,
    null,
  ],
  ["SWITCH([[FALSE,1],[FALSE,2]],0)", null, Type.NUMERIC],
  ["SWITCH([['a',1],['b',2]],0)", WrongFunctionArgumentTypeException, null],
  [
    "SWITCH([[FALSE,1],[TRUE,2]],'a')",
    WrongFunctionArgumentTypeException,
    null,
  ],
])(
  "Parse IfcExpression",
  (input: string, expectedException: any, expectedType: ExprType) => {
    it(`parse("${input}"): ${
      expectedException === null ? "ok" : expectedException.name
    }`, () => {
      const errorListener = new IfcExpressionErrorListener();
      const expr = IfcExpression.parse(input, errorListener);
      if (expectedException === null) {
        expect(errorListener.getException()).toBe(undefined);
        expect(
          expr.typeManager.getType(expr.parseTree).isSameTypeAs(expectedType)
        );
      } else {
        expect(errorListener.isErrorOccurred()).toBe(true);
        const actualException = errorListener.getException();
        expect(actualException).not.toBeUndefined();
        const className = actualException.constructor.name;
        expect(className).toBe(expectedException.name);
      }
    });
  }
);
