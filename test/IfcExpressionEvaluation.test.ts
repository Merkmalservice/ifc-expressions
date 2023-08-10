import {
  IfcExpression,
  isExprEvalError,
  isExprEvalSuccess,
} from "../src/IfcExpression.js";
import Decimal from "decimal.js";
import { NumericValue } from "../src/value/NumericValue.js";
import { StringValue } from "../src/value/StringValue.js";
import { BooleanValue } from "../src/value/BooleanValue.js";
import {
  ExprEvalFunctionEvaluationConsequentialErrorObj,
  ExprEvalFunctionEvaluationObjectNotFoundErrorObj,
  ExprEvalStatus,
  ExprEvalSuccess,
  ExprEvalSuccessObj,
  ExprEvalWrongFunctionArgumentTypeErrorObj,
} from "../src/expression/ExprEvalResult.js";

import { ExprKind } from "../src/expression/ExprKind.js";
import { ctxSimple } from "./SimpleIfcExpressionContext.js";
import { NumericLiteralExpr } from "../src/expression/numeric/NumericLiteralExpr.js";
import { PlusExpr } from "../src/expression/numeric/PlusExpr.js";
import { E } from "../src/E.js";
import { TextSpan } from "../src/util/TextSpan.js";
import { Type, Types } from "../src/type/Types.js";
import { WrongFunctionArgumentTypeException } from "../src/error/WrongFunctionArgumentTypeException.js";

describe.each([
  ["1", new Decimal("1")],
  [new NumericLiteralExpr(1).toExprString(), new Decimal(1)],
  ["1.5", new Decimal("1.5")],
  [new NumericLiteralExpr(1.5).toExprString(), new Decimal(1.5)],
  ["1+1", new Decimal("2")],
  [
    new PlusExpr(
      new NumericLiteralExpr(1),
      new NumericLiteralExpr(1)
    ).toExprString(),
    new Decimal(2),
  ],
  ["2*3", new Decimal("6")],
  ["6/2", new Decimal("3")],
  ["6-2", new Decimal("4")],
  ["1/5", new Decimal("0.2")],
  ["2*2+1", new Decimal("5")],
  ["1+2*2", new Decimal("5")],
  ["(1+2)*2", new Decimal("6")],
  ["(1+(2)*2)", new Decimal("5")],
  ["[1,2,3]", [new NumericValue(1), new NumericValue(2), new NumericValue(3)]],
  ["ROUND(1.1,0)", new Decimal("1")],
  ["ROUND(0.5,0)", new Decimal("1")],
  ["ROUND(-0.5,0)", new Decimal("-1")],
  ["ROUND(-0.5,1)", new Decimal("-0.5")],
  ["ROUND(-0.15,1)", new Decimal("-0.2")],
  ["ROUND(-0.15,0)", new Decimal("-0")],
  ["ROUND(1.1,1)", new Decimal("1.1")],
  ["ROUND(1.11,1)", new Decimal("1.1")],
  ["ROUND(1.149,1)", new Decimal("1.1")],
  ["ROUND(1.15,1)", new Decimal("1.2")],
  ['MAP("rot", [["rot", "red"],["grün","green"],["blau", "blue"]])', "red"],
  ['MAP("grün", [["rot", "red"],["grün","green"],["blau", "blue"]])', "green"],
  ['MAP("blau", [["rot", "red"],["grün","green"],["blau", "blue"]])', "blue"],
  ["MAP(1, [[1,10],[2,20],[3,30]])", new Decimal(10)],
  [
    'MAP("blau", [["rot", "red"],["grün","g"+"r"+"ee"+"n"],["blau", "bl"+"ue"]])',
    "blue",
  ],
  [
    'MAP("yellow", [["rot", "red"],["grün","green"],["blau", "blue"]], "not found")',
    "not found",
  ],
  [
    E.fun(
      "MAP",
      E.string("rot"),
      E.array(
        E.array(E.string("rot"), E.string("red")),
        E.array(E.string("grün"), E.string("green")),
        E.array(E.string("blau"), E.string("blue"))
      ),
      E.string("[not mapped]")
    ).toExprString(),
    "red",
  ],
  ["TRUE && TRUE", true],
  ["TRUE && false", false],
  ["false && TRUE", false],
  ["FALSE || TRUE", true],
  ["false || false", false],
  ["false >< false", false],
  ["true >< true", false],
  ["false >< true", true],
  ["true >< false", true],
  ["TRUE && FALSE", false],
  ["(TRUE||FALSE) && TRUE", true],
  ["TRUE.and(FALSE)", false],
  ["false.not()", true],
  ["AND(TRUE, FALSE)", false],
  ["TRUE && FALSE >< FALSE", false],
  ["TRUE.implies(TRUE)", true],
  ["IMPLIES(FALSE, FALSE)", true],

  ["CHOOSE([[TRUE,1],[FALSE,2]],0)", new Decimal(1)],
  ["CHOOSE([[TRUE,1],[TRUE,2]],0)", new Decimal(1)],
  ["CHOOSE([[FALSE,1],[TRUE,2]],0)", new Decimal(2)],
  ["CHOOSE([[FALSE,1],[FALSE,2]],0)", new Decimal(0)],

  ["CONTAINS('ABC', 'AB')", true],
  ["CONTAINS('ABC', 'AB*')", true],
  ["CONTAINS('ABC', 'B')", true],
  ["CONTAINS('ABC', '')", false],
  ["CONTAINS('ABC', ' ')", false],
  ["CONTAINS('ABC', '*')", true],

  ["MATCHES('ABC', 'AB')", false],
  ["MATCHES('ABC', 'AB*')", true],
  ["MATCHES('ABC', 'B')", false],
  ["MATCHES('ABC', '')", false],
  ["MATCHES('ABC', ' ')", false],
  ["MATCHES('ABC', '*')", true],

  ["REGEXCONTAINS('ABC', 'AB*')", true],
  ["REGEXCONTAINS('ABC', 'AB?')", true],
  ["REGEXCONTAINS('ABC', 'A(?!B)')", false],
  ["REGEXCONTAINS('ABC', '[ABCDEFG]')", true],

  ["REGEXMATCHES('ABC', 'AB*')", false],
  ["REGEXMATCHES('ABC', 'AB?')", false],
  ["REGEXMATCHES('ABC', 'A(?!B)')", false],
  ["REGEXMATCHES('ABC', '[ABCDEFG]')", false],
  ["REGEXMATCHES('ABC', 'AB.*')", true],
  ["REGEXMATCHES('ABC', 'ABCD?')", true],
  ["REGEXMATCHES('ABC', 'A(?!X)BC')", true],
  ["REGEXMATCHES('ABC', '[ABCDEFG]+')", true],
  ["1>2", false],
  ["2>2", false],
  ["3>2", true],
  ["'aaa'>'bbb'", false],
  ["'aaa'>'aaa'", false],
  ["'bbb'>'aaa'", true],
  ["TRUE > FALSE", true],
  ["TRUE > TRUE", false],
  ["FALSE > TRUE", false],
  ["1>=2", false],
  ["2>=2", true],
  ["3>=2", true],
  ["'aaa'>='bbb'", false],
  ["'aaa'>='aaa'", true],
  ["'bbb'>='aaa'", true],
  ["TRUE >= FALSE", true],
  ["TRUE >= TRUE", true],
  ["FALSE >= TRUE", false],
  ["1<2", true],
  ["2<2", false],
  ["3<2", false],
  ["'aaa'<'bbb'", true],
  ["'aaa'<'aaa'", false],
  ["'bbb'<'aaa'", false],
  ["TRUE < FALSE", false],
  ["TRUE < TRUE", false],
  ["FALSE < TRUE", true],
  ["1<=2", true],
  ["2<=2", true],
  ["3<=2", false],
  ["'aaa'<='bbb'", true],
  ["'aaa'<='aaa'", true],
  ["'bbb'<='aaa'", false],
  ["TRUE <= FALSE", false],
  ["TRUE <= TRUE", true],
  ["FALSE <= TRUE", true],
  ["1==2", false],
  ["2==2", true],
  ["3==2", false],
  ["'aaa'=='bbb'", false],
  ["'aaa'=='aaa'", true],
  ["'bbb'=='aaa'", false],
  ["TRUE == FALSE", false],
  ["TRUE == TRUE", true],
  ["FALSE == TRUE", false],
  ["FALSE.equals(FALSE)", true],
  ["equals(FALSE, FALSE)", true],
  ["equals(TRUE, TRUE)", true],
  ["equals(FALSE, 'FALSE')", false],
  ["FALSE.equals(TRUE)", false],
  ["NOT(false.equals(true))", true],
  ["1.greaterThan(2)", false],
  ["greaterThan(2,1)", true],
  ["'1'.greaterThan('2')", false],
  ["greaterThan('2','1')", true],
  ["TRUE.greaterTHAN(FALSE)", true],
  ["FALSE.greaterTHAN(true)", false],
  ["greaterThanOrEqual(1,1)", true],
  ["greaterThanOrEqual(1,2)", false],
  ["greaterThanOrEqual(2,1)", true],
  ["greaterThanOrEqual('1','1')", true],
  ["greaterThanOrEqual('1','2')", false],
  ["greaterThanOrEqual('2','1')", true],
  ["greaterThanOrEqual(TRUE,FALSE)", true],
  ["greaterThanOrEqual(FALSE,TRUE)", false],
  ["greaterThanOrEqual(TRUE,TRUE)", true],
  ["1.lessThan(2)", true],
  ["lessThan(2,1)", false],
  ["'1'.lessThan('2')", true],
  ["lessThan('2','1')", false],
  ["TRUE.lessTHAN(FALSE)", false],
  ["FALSE.lessTHAN(true)", true],
  ["lessThanOrEqual(1,1)", true],
  ["lessThanOrEqual(1,2)", true],
  ["lessThanOrEqual(2,1)", false],
  ["lessThanOrEqual('1','1')", true],
  ["lessThanOrEqual('1','2')", true],
  ["lessThanOrEqual('2','1')", false],
  ["lessThanOrEqual(TRUE,FALSE)", false],
  ["lessThanOrEqual(FALSE,TRUE)", true],
  ["lessThanOrEqual(TRUE,TRUE)", true],
  ["'BETON'.regexReplace('ON', 'E')", "BETE"],
  ["'BETON'.replace('ON', 'E')", "BETE"],
  ["'BETON'.regexReplace('BET(?!T)', 'GAST')", "GASTON"],
  ["'BETON'.replace('B*O', 'KRA')", "KRAN"],
  ["IF(TRUE,1,2)", new Decimal(1)],
  ["IF(FALSE,1,'a')", "a"],
  ["IF(TRUE,FALSE,'a')", false],
])("ifcExpression (no context)", (input: string, result: any) => {
  it(`evaluate("${input}") = ${result}`, () => {
    const actualResult = IfcExpression.evaluate(input);
    expect(isExprEvalSuccess(actualResult)).toBe(true);
    expect(
      (actualResult as ExprEvalSuccess<any>).result.getValue()
    ).toStrictEqual(result);
  });
});

describe.each([
  [
    1,
    "$property.value()",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    2,
    "VALUE($property)",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    3,
    "$property.value() / 12",
    new ExprEvalSuccessObj(NumericValue.of(10)),
    ctxSimple,
  ],
  [
    4,
    "value($property) / 12",
    new ExprEvalSuccessObj(NumericValue.of(10)),
    ctxSimple,
  ],
  [
    5,
    "$property.name()",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    6,
    "NAME($property)",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    7,
    "$element.name()",
    new ExprEvalSuccessObj(
      StringValue.of("Geschossdecke:DE_STB - 20,0 cm:2309081")
    ),
    ctxSimple,
  ],
  [
    8,
    "name($element)",
    new ExprEvalSuccessObj(
      StringValue.of("Geschossdecke:DE_STB - 20,0 cm:2309081")
    ),
    ctxSimple,
  ],
  [
    9,
    "$element.property('Bewehrungsgrad').value()",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    10,
    "VALUE(PROPERTY($element, 'Bewehrungsgrad'))",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    11,
    "$element.property('Bewehrungsgrad').name()",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    12,
    "Name($element.property('Bewehrungsgrad'))",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    13,
    '$element.property("Bewehrungsgrad").name() + " " + $property.value().toString()',
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad 120")),
    ctxSimple,
  ],
  [
    14,
    '$property.propertySet().name() + ": " + $element.property("Bewehrungsgrad").name() + " " + $property.value().toString()',
    new ExprEvalSuccessObj(StringValue.of("PSet_Betonbau: Bewehrungsgrad 120")),
    ctxSimple,
  ],
  [
    15,
    "$element.property('Sichtbeton').value()",
    new ExprEvalSuccessObj(BooleanValue.of(true)),
    ctxSimple,
  ],
  [
    16,
    "$element.ifcClass()",
    new ExprEvalSuccessObj(StringValue.of("IfcSlab")),
    ctxSimple,
  ],
  [
    17,
    "$element.property('dontFindThisProperty').value()",
    new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.IFC_PROPERTY_NOT_FOUND,
      "No ifc property found with name 'dontFindThisProperty'",
      "PROPERTY",
      "dontFindThisProperty",
      TextSpan.of(1, 10, 1, 41)
    ),
    ctxSimple,
  ],
  [
    18,
    "$element.propertySet('PSet_Betonbau').property('dontFindThisProperty').value()",
    new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.IFC_PROPERTY_NOT_FOUND,
      "No ifc property found with name 'dontFindThisProperty'",
      "PROPERTY",
      "dontFindThisProperty",
      TextSpan.of(1, 39, 1, 70)
    ),
    ctxSimple,
  ],
  [
    19,
    "$property.propertySet().name()",
    new ExprEvalSuccessObj(new StringValue("PSet_Betonbau")),
    ctxSimple,
  ],
  [
    20,
    "$property.propertySet().property('dontFindThisProperty').value()",
    new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.IFC_PROPERTY_NOT_FOUND,
      "No ifc property found with name 'dontFindThisProperty'",
      "PROPERTY",
      "dontFindThisProperty",
      TextSpan.of(1, 25, 1, 56)
    ),
    ctxSimple,
  ],
  [
    21,
    "$element.propertySet('dontFindThisPropertySet').property('dontFindThisProperty').value()",
    new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND,
      "No ifc property set found with name 'dontFindThisPropertySet'",
      "PROPERTYSET",
      "dontFindThisPropertySet",
      TextSpan.of(1, 10, 1, 47)
    ),
    ctxSimple,
  ],
  [
    22,
    "$element.propertySet('PSet_Betonbau').property('Bewehrungsgrad').value()",
    new ExprEvalSuccessObj(NumericValue.of(120)),
    ctxSimple,
  ],
  [
    23,
    "$element.type().name()",
    new ExprEvalSuccessObj(StringValue.of("Geschoßdecke")),
    ctxSimple,
  ],
  [
    24,
    "$element.type().propertySet('PSet_Betonbau').property('Bewehrungsgrad').name()",
    new ExprEvalSuccessObj(StringValue.of("Bewehrungsgrad")),
    ctxSimple,
  ],
  [
    25,
    "$element.type().propertySet('dontFindThisPropertySet').property('Bewehrungsgrad').name()",
    new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND,
      "No ifc property set found with name 'dontFindThisPropertySet'",
      "PROPERTYSET",
      "dontFindThisPropertySet",
      TextSpan.of(1, 17, 1, 54)
    ),
    ctxSimple,
  ],
  [
    26,
    "CHOOSE([[$element.property('Betonguete').value().CONTAINS('C20'), 'C20'],[$element.property('Betonguete').value().CONTAINS('C25'),'C25']],'C??')",
    new ExprEvalSuccessObj(StringValue.of("C25")),
    ctxSimple,
  ],
  [
    27,
    "EXISTS($property.propertySet().property('dontFindThisProperty'))",
    new ExprEvalSuccessObj(BooleanValue.of(false)),
    ctxSimple,
  ],
  [
    28,
    "EXISTS($property.propertySet().property('Betonguete'))",
    new ExprEvalSuccessObj(BooleanValue.of(true)),
    ctxSimple,
  ],
  [
    29,
    "EXISTS($element.propertySet('PSet_Betonbau'))",
    new ExprEvalSuccessObj(BooleanValue.of(true)),
    ctxSimple,
  ],
  [
    30,
    "EXISTS($element.propertySet('dontFindThisPropertySet'))",
    new ExprEvalSuccessObj(BooleanValue.of(false)),
    ctxSimple,
  ],
  [
    31,
    "'the value is ' + $property.value().toString()",
    new ExprEvalSuccessObj(StringValue.of("the value is 120")),
    ctxSimple,
  ],
  [
    32,
    "$property.value() + $element.property('Bewehrungsgrad').value() * 1000 + $element.property('Bewehrungsgrad').value() * 1000",
    new ExprEvalSuccessObj(NumericValue.of(240120)),
    ctxSimple,
  ],
  [
    33,
    "IF($property.value() > 100, 'large', 'small')",
    new ExprEvalSuccessObj(StringValue.of("large")),
    ctxSimple,
  ],
])(
  "ifcExpression (with 'simple' context)",
  (testCase: number | string, input: string, result: any, context: any) => {
    it(`case ${testCase}: evaluate("${input}", ctx) = ${result}`, () => {
      const actualResult = IfcExpression.evaluate(input, context);
      expect(actualResult).toStrictEqual(result);
      //if (isExprEvalError(actualResult)){
      //  expect(IfcExpression.formatError(input, actualResult)).toBe("somethingelse");
      //}
    });
  }
);

describe("ifcExpression", () => {
  it(".evaluate() does not throw", () => {
    expect(() => IfcExpression.evaluate("1+")).not.toThrow();
  });
  it(".parse() does not throw ", () => {
    expect(() => IfcExpression.parse("1+")).not.toThrow();
  });
});
