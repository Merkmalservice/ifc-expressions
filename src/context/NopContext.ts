import {
  IfcElementAccessor,
  IfcExpressionContext,
  IfcPropertyAccessor,
} from "../IfcExpression.js";

export class NopContext implements IfcExpressionContext {
  resolveElemRef(): IfcElementAccessor {
    throw new Error(
      "No IfcExpressionContext implementation provided - cannot resolve element reference"
    );
  }

  resolvePropRef(): IfcPropertyAccessor {
    throw new Error(
      "No IfcExpressionContext implementation provided - cannot resolve property reference"
    );
  }
}
