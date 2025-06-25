# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.3.0 - 2025-06-25

### Fixed

- Add type declarations in dist/index.d.ts and export them through package.json

## 2.3.0-beta.1 - 2024-10-08

### Fixed

- Correct handling of local dates/times

## 2.3.0-beta.0 - 2024-10-08

### Fixed

- Add missing exports to `ifcExpressions.ts`

## 2.2.0-beta.0 - 2024-10-04

### Added

- Add temporal types representing
  - IfcDate
  - IfcDateTime
  - IfcTime
  - IfcDuration
  - IfcTimeStamp
- Add 'TO'-methods to create temporal values.

## 2.1.1 - 2023-11-03

### Fixed

- Fix error in .github/release-and-deploy.yml that results in duplicate tags on github with a prepended 'v' in the name

## 2.1.0 - 2023-11-03

### Added

- Add string manipulation functions
  - `toUpperCase()`
  - `toLowerCase()`
  - `substring(from, to)`
  - `substring(from)`
  - `split(start)`
  - `split(start, end)`
- Add array access function `at(index)`
- Add license declaration to package.json

### Fixed

- Add Check for spurious funcion arguments

## 2.0.1 - 2023-08-23

## 2.0.1-beta.8 - 2023-08-14

### Added

- support for logical wherever boolean is allowed

## 2.0.1-beta.7 - 2023-08-11

### Added

- toNumeric(alias: toNumber)
- toBoolean()

### Changed

- RegexReplace and RegexMatch allow (a subset of) standard js regex flags
- functions can have alias names

## 2.0.1-beta.6 - 2023-08-11

## 2.0.1-beta.5 - 2023-08-10

## 2.0.1-beta.4 - 2023-08-10

### Added

- ExprFacade
- add '.js' extension for local imports to mjs and cjs transpile output via gulp-replace

## 2.0.1-beta.3 - 2023-08-10

## 2.0.1-beta.2 - 2023-08-10

## 2.0.1-beta.1 - 2023-08-10

### Added

- IF function
- TextSpan, TextPosition (for locating errors)
- Make sure every error has the text location set
- Read up on semver ;-)

### Changed

- rename function SWITCH to CHOOSE
- refactor `Expr.toExprString()` such that it uses a builder, which allows us to track the text position of the expr in the generated string.
- refactor folder structure

## 2.0.1-beta.0 - 2023-08-08

### Fixed

- Make SWITCH and MAP type checks more lenient, will allow types that overlap with expected, might fail upon evaluation

## 2.0.0-beta.0 - 2023-08-08

### Added

- getType() method to Value, for easier evaluation-time type checks. Not ideal but works.

### Fixed

- PlusOrConcat checks are more optimistic, will allow values that overlap with expected, might fail upon evaluation

## 1.0.0-beta.0 - 2023-08-08

### Added

- add comarison operators and functions
- add simple type inference for parse-time and compile-time errors
- add tuple type and type disjunction
- power function, e.g. `2^4`
- boolean expressions

### Changed

- Allow for method-style function invocation, such as `"abc ".trim()` (given a trim function exists that takes a string).
- Clean up the syntax a bit, so that there are fewer secrets that one needs to know
- Accessing property, property set, and type is now done using functions. Those who like spreadsheet formulae will appreciate that they can now write `VALUE(PROPERTY(PROPERTYSET($element,'PSet_WallCommon'),'width'))`. All others will cheer for `$element.propertySet('PSet_WallCommon').property('width').value()`, which is equivalent, as is any combination of the two styles.

### Fixed

- Fix a few quirks around associativity. You don't want to know.

## 0.3.4 - 2023-07-27

### Fixed

- fix captalization typo in package.json (referencing 'ifcExpression.js' instead of 'IfcExpression.js')

## 0.3.3 - 2023-07-26

### Fixed

- add missing re-exports

## 0.3.2 - 2023-07-26

### Fixed

- add missed '.js' suffixes in imports

## 0.3.1 - 2023-07-25

### Added

- importing with '.js' suffix

## 0.3.0 - 2023-07-25

### Added

- Array Expressions
- Function Expressions
- MAP()
- ROUND()

## 0.2.3 - 2023-06-27

## 0.2.2 - 2023-06-21

### Changed

- Added all required source files to the published package

## 0.2.1 - 2023-06-20

### Changed

- Exported the context package

## 0.2.0 - 2023-06-20

### Changed

- Refactored package structure
- Added exports to IfcExpression.ts

## 0.1.0 - 2023-06-20

### Added

- An Antlr4 grammar for ifc expressions
- A visitor that converts the parse output into an expression tree
- An expression Hierarchy that evaluates to a value (which can be a single value, an array or an array of arrays)
- A context (IfcExpressionContext) that is used by the client to provide access to the IFC model
- Integration Tests with mocked contexts
