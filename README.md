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
import { IfcExpression } from "ifc-expression";
import { IfcExpressionContext } from "./IfcExpressionContext";

const result = IfcExpression.evaluate("1 + 1"); // evaluation without context
console.log(JSON.stringify(result));
// ExprEvalSuccessObj {
//   status: 1000,
//   result: NumericValue {
//     value: 2
//   }
// }
const ctx: IfcExpressionContext = ...; // set to your context here
const result2 = IfcExpression.evaluate(
  "$element.property('width').value() * 2",
  ctx
);
```

## Plain JS Value Unwrapping

`IfcExpression.evaluate(...)` returns library value objects such as `NumericValue`, `StringValue`, `LogicalValue`, `ContextObjectValue`, or IFC object references.
If you want a plain value structure for downstream code, use `IfcExpression.unwrapValue(...)` on the successful result value.

```ts
import { IfcExpression, isExprEvalSuccess } from "ifc-expression";

const evaluation = IfcExpression.evaluate("$result.statusCode", ctx, {
  builtinVariableRegistry,
});

if (isExprEvalSuccess(evaluation)) {
  const value = IfcExpression.unwrapValue(evaluation.result);
  // value is a Decimal here
}
```

`unwrapValue` preserves the expression model's precision and nullability semantics:

- `NumericValue` and raw JS `number` values inside client builtin objects become `Decimal`
- `StringValue` becomes `string`
- `BooleanValue` becomes `boolean`
- `LogicalValue.UNKNOWN` becomes `undefined`
- `IfcTimeStampValue` becomes `Decimal`
- `IfcDateValue`, `IfcDateTimeValue`, `IfcTimeValue`, and `IfcDurationValue` become their canonical string representation
- arrays are unwrapped recursively
- client builtin objects are unwrapped recursively to plain JS object structures
- IFC object references such as `$element` and `$property` are unwrapped to plain objects containing their addressable attributes

For IFC object references, unwrapping currently includes object attributes only. It does not recursively expand nested IFC object relations such as property sets or parent/child IFC objects.

## Client Builtins

In addition to the built-in IFC roots `$element` and `$property`, clients can register their own reserved builtins.
These builtins are configured at parse/compile time through `BuiltinVariableRegistry`, and their values are provided at evaluation time through `IfcExpressionContext.resolveBuiltinVariable(name)`.

Client builtins support:

- reserved names such as `$query`, `$result`, `$thequery`, or any other configured builtin name
- dotted property access such as `$result.statusCode`
- dotted function access such as `$query.matches('name')`
- static typing of members during parse/compile time
- protection against shadowing by ordinary identifiers

Example:

```ts
import {
  BuiltinVariableRegistry,
  IfcExpression,
  Type,
} from "ifc-expression";

const builtinVariableRegistry = new BuiltinVariableRegistry([
  {
    name: "$query",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "property",
        kind: "property",
        valueType: Type.STRING,
      },
      {
        name: "matches",
        kind: "function",
        argumentTypes: [Type.STRING],
        returnType: Type.BOOLEAN,
      },
    ],
  },
  {
    name: "$result",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "statusCode",
        kind: "property",
        valueType: Type.NUMERIC,
      },
    ],
  },
]);

const parseResult = IfcExpression.parse("$query.matches('name') && $result.statusCode == 200", undefined, {
  builtinVariableRegistry,
});
```

At evaluation time, the context supplies the values for those builtins:

```ts
import { IfcExpressionContext } from "ifc-expression";

const ctx: IfcExpressionContext = {
  resolveElemRef() {
    return elementAccessor;
  },
  resolvePropRef() {
    return propertyAccessor;
  },
  resolveBuiltinVariable(name: string) {
    switch (name) {
      case "query":
        return {
          property: "LoadBearing",
          matches(value: string) {
            return this.property === value;
          },
        };
      case "result":
        return {
          statusCode: 200,
        };
      default:
        return undefined;
    }
  },
};
```

`CONTEXT_OBJECT_REF` is intended for client-supplied evaluation-context objects.
`IFC_OBJECT_REF` and its subtypes remain reserved for actual objects addressable in the IFC model.

## Autocomplete

`ifc-expressions` exposes autocomplete through `IfcExpressionAutocomplete.complete(input, cursorOffset, options)`.
The autocompleter is aware of builtin roots, builtin functions, typed dotted member access, and function argument help.

```ts
import {
  BuiltinVariableRegistry,
  IfcExpressionAutocomplete,
  Type,
} from "ifc-expression";

const builtinVariableRegistry = new BuiltinVariableRegistry([
  {
    name: "$query",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "property",
        kind: "property",
        valueType: Type.STRING,
      },
      {
        name: "matches",
        kind: "function",
        argumentTypes: [Type.STRING],
        returnType: Type.BOOLEAN,
      },
    ],
  },
]);

const completion = IfcExpressionAutocomplete.complete("$query.mat", 10, {
  builtinVariableRegistry,
});

console.log(completion.items);
```

The returned `CompletionResult` contains:

- `items`: completion items for builtin roots, builtin functions, builtin member properties, and builtin member functions
- `replaceFrom` and `replaceTo`: the text range to replace when applying a completion
- `activeHelp`: optional signature help for the function or member function currently being typed

Each `CompletionItem` can include:

- `label`: the completion label
- `insertText`: text to insert, for example `REPLACE()`
- `cursorOffset`: where to place the cursor after insertion
- `argumentTypeNames`: argument types for callable member suggestions
- `returnTypeName`: return type for typed member suggestions
- `chainable`: whether the suggested member returns another object that can be accessed with `...`
- `documentation`: a localized one-line description

### Autocomplete Hooks

The autocomplete surface is shaped by two inputs:

- `builtinVariableRegistry`: supplies reserved builtin roots and the typed member tree used for dotted access completion
- `localizer`: translates builtin, member, and function documentation plus active argument help

That means the same builtin definitions you use for parsing and evaluation also drive autocomplete. If a client registers `$thequery` or `$theresult`, those exact reserved names, their typed members, and their member functions participate in completion automatically.

Example with localization:

```ts
const completion = IfcExpressionAutocomplete.complete("REP", 3, {
  localizer: {
    t(key, fallback) {
      return translations[key] ?? fallback;
    },
  },
});

console.log(completion.items[0].label);
// REPLACE
console.log(completion.items[0].documentation);
// e.g. "REPLACE(input, pattern, replacement): replace <pattern> in <input> with <replacement>"
```

When the cursor is inside a function call, `activeHelp` contains the current signature and the active parameter's label and documentation when available. This works for both global builtin functions and typed builtin member functions.

## Quick Reference

Get the current property value:

`$property.value()`

Get the name of the property set the property is in:

`$property.propertySet().name()`

Get the name of the current element:

`$element.name()`

Get the name of the type of the current element:

`$element.type().name()`

Get value of property `myProp` from property set `myPset` in the current element:

`$element.propertySet('myPset').property('myProp').value()`

The last expression can also be written as

`VALUE(PROPERTY(PROPERTY_SET($element, 'myPset'),'myProp'))`

Check if property `myProp` exists in property set `myPset` in the current element:

`EXISTS($element.propertySet('myPset').property('myProp'))`

Hints:

- Function/Method names are case-insensitive
- you have `+ - * / ^` for numerics
- you have `&& || >< !` for booleans (`><` is xor)
- you have `== != >= <= > <` for strings, booleans and numerics
- you have a `.toString()` method on anything (or, equivalently, a function `toString(x)` for any `x`).
- you have `REPLACE`, which only knows the wildcard character `*`. (same for `MATCHES`, `CONTAINS`)
- you have `REGEXREPLACE` with full js Regular Expressions (same for `REGEXMATCHES`, `REGEXCONTAINS`)

## IFC Expression Language Syntax

The project uses ANTLR4 for parsing. The grammar is in `src/grammar/IfcExpression.g4`.

The result of expression evaluation is a value of type `string`, `numeric`, `boolean`, `ifcObjectRef`, `contextObjectRef`, or a temporal type (`IfcDateTime`, `IfcDate`, `IfcTime`, `IfcDuration`, and `IfcTimeStamp`). `ifcObjectRef` is a reference to some object in the IFC model. `contextObjectRef` is a client-supplied builtin object from the evaluation context.

The language allows for specifying _a single expression_. There are no control statements and there is no way
to define custom functions or custom types.

An expression can be

- a literal, such as `'hello world'`, or `17`
- a variable reference, such as `$property`, `$element`, or a configured client builtin such as `$query`

... or a combination of multiple expressions:

- a function call, such as `REPLACE("hello world", "world", "friends")`
- a function call in 'method-call style', such as `"hello world".replace("world", "friends")`
- a combination using operators, such as `+`, `&&`, `==`

### Types

- `string`, e.g. `'abc'` or `"abc"`: text enclosed in single or double quotes
- `boolean`, e.g. `TRUE` or `false`: true or false, either spelled all-uppercase or all-lowercase
- `numeric`, e.g. `1` or `3.141`: a decimal number optionally containing one period to separate integer part from fractional part
- `array`, e.g. `[1,2,"hi there"]`: an ordered list of expressions
- `contextObjectRef`: a typed client builtin object configured in `BuiltinVariableRegistry`

### Operators

- numeric operators
  - `+`, `-`, `*`, `/`: plus, minus, multiplication, division - with the usual precedence rules and associativity
  - `^`: raise to the power, e.g. `2^3` (= 8)
- boolean operators
  - `&&`, `||`, `><`: boolean and, or, xor
  - `!`: boolean not
- string operators
  - `+`: string concatenation

### Functions

#### conversion functions

`toString(a)`, `toNumeric(a)`, `toIfcDateTime(a)`, etc.

#### temporal functions

`addDuration(IfcTimeStamp|IfcDateTime, IfcDuration)`

#### comparison functions

`equals(a,b)`, `greaterThan(a,b)`, `greaterThanOrEqual(a,b)`, `lessThan(a,b)`, `lessThanOrEqual(a,b)`

#### boolean operator functions

`not(a)`, `and(a,b)`, `or(a,b)`, `xor(a,b)`, `implies(a,b)`

#### string matching

`contains(string, pattern)`, e.g. `contains('hello world', 'he*o')` returns true if the string contains the pattern. `*` matches any number of characters.

`regexContains(string, regex)`, e.g. `regexContains('hello, world', 'h[aeiou]ll[aeiou]+\\s')` returns true if the string contains the regular expression.

`matches(string, pattern)`, e.g. `matches('hello world', 'he*o')` returns true if the whole string matches the pattern. `*` matches any number of characters.

`regexMatches(string, regex)`, e.g. `regexMatches('hello, world', 'h[aeiou]ll[aeiou]+\\s')` returns true if the whole string matches the regular expression.

#### string replacement

`replace(string, pattern, replacement)`, e.g. `replace('hello world', 'he*o', 'bye')` returns the `string`, with all occurrences of the `pattern` replaced with `replacement`. `*` matches any number of characters.

`regexReplace(string, regex, replacement)`, e.g. `regexReplace('hello, world', 'h([aeiou]ll[aeiou]+) ', 'm$1w ')` returns the `string`, with all occurrences of the `regex` replaced with `replacement`.

#### ifc object accessor functions

`property(object: ifcPropertySetRef|ifcTypeObjectRef|ifcElementRef, name: string)`: returns an `ifcPropertyRef` or an error if object has no property with that name

`propertySet(object: ifcProperty)`: returns an `ifcPropertySetRef`

`propertySet(object: ifcTypeObjectRef|ifcElementRef, name: string)`: returns an `ifcPropertySetRef` or an error if the element or type has no property set with that name

`type(object: ifcElementRef)`: returns an `ifcTypeObjectRef` or an error

`exists(object: ifcObjectRef): boolean`: checks whether an object reference obtained by the above methods actually exists (suppresses the error they generate)

#### translation and condition functions

`map(input, mapping: [[in, out], [in, out], ...], default)`: finds the first `[in, out]` pair in the specified mapping where `in == input` and returns that pair's `out` value. If none is found, `default` is returned.

`if(condition, thenValue, elseValue)`: returns `thenValue` if `condition` is `true`, `elseValue` otherwise.

`choose([[condition, out], [condition, out], ...], default)`: finds the first `[condition, out]` pair where `condition == true` and returns its `out` value. If none is found, `default` is returned.
