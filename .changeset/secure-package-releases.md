---
"ifc-expressions": major
"ifc-expressions-units": patch
"ifc-expressions-units-qudtlib": patch
---

Add provider-backed IFC units and measures, including conversions, comparisons,
and unit provenance. Add a lazy `EXISTS(expression)` guard, improve completion
for nested expressions and builtin results, and support coordinated npm releases.

Mixed boolean operators now bind in the order `!`, `&&`, `><`, `||`.
Parenthesize mixed operators to preserve the evaluation order of an existing
expression. `EXISTS` is reserved and must be called as `EXISTS(expression)`.
