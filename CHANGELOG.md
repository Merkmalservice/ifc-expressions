# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.3.0 - 2023-07-25

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
