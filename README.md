# IFC Expressions

This project defines an expression language for IFC models. An expression is evaluated in the context of an element of the IFC model and a specific property of that element.

## Interface

Two ways to interact with 'ifc-expression':

- evaluate an expression string directly - receive `ExprEvalSuccessResult | ExprEvalError`

or

- parse an expression - receive a `IfcExpressionParseResult`
- evaluate a `IfcExpressionParseResult` - receive `ExprEvalSuccessResult | ExprEvalError`

## Usage

To connect `ifc-expressions` with your IFC model, you have to provide an
implementation of `src/context/IfcExpressionContext`. Without such a context, the expressions that
contain references to the model cannot be evaluated.

```ts
import {IfcExpression} from "ifc-expression";
import {IfcExpressionContext} from "./IfcExpressionContext";

const result = IfcExpression.evaluate("1 + 1"); // evaluation without context
console.log(JSON.stringify(result));
// ExprEvalSuccessObj {
//   status: 1000,
//   result: NumericValue {
//     value: 2
//   }
//}
const ctx: IfcExpressionContext = ... ; // set to your context here
const result2 = IfcExpression.evaluate("$element.property('width').value() * 2 ", ctx);
```

## Quick Reference

Get the current property value:

`$property.value()`

Get the name of the property set the property is in:

`$property.propertySet.name()`

Get the name of the current element:

`$element.name()`

Get the name of the type of the current element:

`$element.type().name()`

Get value of property `myProp` from property set `myPset` in the current element:

`$element.propertySet('myPset').property('myProp').value()`

The last expression can also be written as

`VALUE(PROPERTY(PROPERTY_SET($element, 'myPset'),'myProp'))`

Check if property `myProp` exists in property set `myPset` in the current element:

`$element.propertySet('myPset').property('myProp').exists()`

Hints:

- Function/Method names are case-insensitive
- you have `+ - * / ^` for numerics
- you have `&& || >< !` for booleans (`><`is xor)
- you have `==  !=  >=  <=  >  <` for strings, booleans and numerics
- you have a `.toString()` method on anything (or, equivalently, a function `toString(x)` for any `x` ).
- you have `REPLACE`, which only knows the wildcard character `*`. (same for `MATCHES, CONTAINS`)
- you have `REGEXREPLACE` with full js Regular Expressions (same for `REGEXMATCHES, REGEXCONTAINS`)

## IFC Expression Language Syntax

The project uses ANTLR4 for parsing. The grammar is in src/grammar/ifcExpression.g4.

The result of expression evaluation is a value of type `string, numeric, boolean, ifcObjectRef`, where `ifcObjectRef` is a reference to some object in the IFC model.

The language allows for specifying _a single expression_. There are no control statements and there is no way
to define custom functions or custom types.

An expression can be

- a literal, such as `'hello world'`, or `17`
- a variable reference, such as `$property` or `$element`,(for accessing the IFC model).

... or a combination of multiple expressions:

- a function call, such as `REPLACE("hello world", "world", "friends")`
- a function call in 'method-call style', such as `"hello world".replace("world", "friends")`
- a combination using operators, such as `+`, `&&`, `==`

### Types

- `string`, e.g. `'abc'` or `"abc"`: text enclosed in single or double quotes
- `boolean`, e.g. `TRUE` or `false`: true or false, either spelled all-uppercase or all-lowercase
- `numeric`, e.g. `1` or `3.141`: a decimal number optionally containing one period to separate integer part from fractional part
- `array`, e.g. `[1,2,"hi there"]: an ordered list of expressions

### Operators

- numeric operators
  - '+', '-', '\*', '/': plus, minus, multiplication, division - with the ususal precedence rules and associativity
  - '^': raise to the power or, e.g. `2^3` (= 8)
- boolean operators
  - `&&', `||`, `><`: boolean and, or, xor
  - `!`: boolean not
- string operators
  - '+': string concatenation

### Functions

#### comparison functions

`equals(a,b)`, `greaterThan(a,b)`, `greaterThanOrEquals(a,b)`, `lessThan(a,b)`, `lessThanOrEqual(a,b)`",

#### boolean operator functions

`not(a)`, `and(a,b)`, `or(a,b)`, `xor(a,b)`, `implies(a,b)`

#### string matching

`contains(string, pattern)`, e.g. `contains('hello world', 'he*o')` returns true if the string contains the pattern. `*` matches any number of characters.

`regexContains(string, regex)`, e.g. `regexContains('hello, world', 'h[aeiou]ll[aeiou]+\\\s')` returns true if the string contains the regular expression.

`matches(string, pattern)`, e.g. `matches('hello world', 'he*o')` returns true if the whole string matches the pattern. `*` matches any number of characters.

`regexMatches(string, regex)`, e.g. `regexMatches('hello, world', 'h[aeiou]ll[aeiou]+\\\s')` returns true if the whole string matches the regular expression.

#### string replacement

`replace(string, pattern, replacement)`, e.g. `replace('hello world', 'he*o', 'bye')` returns the `string`, with all occurrences of the `pattern` replaced with `replacement`. `*` matches any number of characters.

`regexReplace(string, regex, replacement)`, e.g. `regexReplace('hello, world', 'h([aeiou]ll[aeiou]+) ', 'm$1w ')` returns the `string`, with all occurrences of the `regex` replaced with `replacement`.

#### ifc object accessor functions

`property(object: ifcPropertySetRef|ifcTypeObjectRef|ifcElementRef, name: string)`: returns an `ifcPropertyRef` or an error or an error if object has no property with that name

`propertySet(object: ifcProperty)`: returns an `ifcPropertySetRef`

`propertySet(object: ifcTypeObjectRef|ifcElementRef, name: string)`: returns an `ifcPropertySetRef` or an error if the element or type has no property set with that name.

`type(object: ifcElementRef)`: returns an `ifcTypeObjectRef` or an error.

`exists(object: ifcObjectRef): boolean` check whether an object reference obtained by the above methods actually exists (suppresses the error they generate)

#### Translation functions

`map(input, mapping: [[in, out], [in, out], ... ], default)`: finds the first `[in,out]` pair in the specified mapping where `in == input` and returns that pair's `out` value. If none is found, `default` is returned.

'switch([[condition, out], [condition, out], ... ]', default): finds the first `[condition, out]` pair where `condition == true` and returns its `out` value. In none is found, `default` is returned.
