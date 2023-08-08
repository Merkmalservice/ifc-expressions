import { Expr } from "./Expr.js";
import { ExprKind } from "./ExprKind.js";
import { isNullish } from "../IfcExpressionUtils.js";

export enum ExprEvalStatus {
  SUCCESS = 1000,
  ERROR = 2000,
  UNDEFINED_RESULT = 2001,
  REFERENCE_ERROR = 2010,
  CONSEQUENTIAL_ERROR = 2020,
  MATH_ERROR = 2030,
  TYPE_ERROR = 2040,
  NOT_FOUND = 2050,
  IFC_PROPERTY_NOT_FOUND = 2051,
  IFC_PROPERTY_SET_NOT_FOUND = 2052,
  IFC_TYPE_OBJECT_NOT_FOUND = 2053,
  PARSE_ERROR = 2080,
  SYNTAX_ERROR = 2081,
  VALIDATION_ERROR = 2082,
  STATIC_TYPE_ERROR = 2083,
  MISSING_OPERAND = 2084,
  MISSING_REQUIRED_FUNCTION_ARGUMENT = 2085,
  UNKNOWN_FUNCTION = 2086,
  WRONG_FUNCTION_ARGUMENT_TYPE = 2088,
}

export function isExprEvalStatus(candidate: number): boolean {
  return (
    typeof candidate === "number" &&
    typeof ExprEvalStatus[candidate] !== "undefined"
  );
}

export type ExprEvalResult<T> = ExprEvalSuccess<T> | ExprEvalError;

export type ExprEvalSuccess<T> = {
  status: ExprEvalStatus;
  result: T;
};

export function isExprEvalSuccess(arg: any): arg is ExprEvalSuccess<unknown> {
  return (
    isExprEvalStatus(arg.status) &&
    arg.status >= ExprEvalStatus.SUCCESS &&
    arg.status < ExprEvalStatus.ERROR &&
    typeof arg.result !== "undefined"
  );
}

export class ExprEvalSuccessObj<T> {
  public readonly result: T;
  public readonly status: ExprEvalStatus;

  constructor(result: T) {
    this.result = result;
    this.status = ExprEvalStatus.SUCCESS;
  }
}

export class ExprEvalErrorObj {
  public readonly status: ExprEvalStatus;
  public readonly exprKind: ExprKind;
  public readonly message?: string;
  constructor(
    exprKind: ExprKind,
    status: ExprEvalStatus = ExprEvalStatus.ERROR,
    message?: any
  ) {
    if (!isExprEvalStatus(status) || status < ExprEvalStatus.ERROR) {
      throw new Error(`ExprEvalStatus ${status} is not an error status"`);
    }
    this.status = status;
    this.exprKind = exprKind;
    if (!isNullish(message)) {
      this.message = mapErrorObjectToMessage(message);
    }
  }
}

export function mapErrorObjectToMessage(errorObjectOrMessage: any): string {
  if (typeof errorObjectOrMessage === "string") {
    return errorObjectOrMessage;
  } else if (errorObjectOrMessage instanceof Error) {
    return errorObjectOrMessage.message;
  } else if (Array.isArray(errorObjectOrMessage)) {
    return errorObjectOrMessage
      .map((m) => this.createErrorMessage(m))
      .join(" ");
  }
  return JSON.stringify(errorObjectOrMessage);
}

export class ExprEvalErrorUndefinedResult extends ExprEvalErrorObj {
  constructor(epxrKind: ExprKind) {
    super(
      epxrKind,
      ExprEvalStatus.UNDEFINED_RESULT,
      "Expression evaluated to undefined or null - this should never happen"
    );
  }
}

export class ExprEvalError1Obj extends ExprEvalErrorObj {
  public readonly sub: ExprEvalResult<unknown>;

  constructor(
    exprKind: ExprKind,
    sub: ExprEvalResult<unknown>,
    status: ExprEvalStatus,
    message?: any
  ) {
    super(exprKind, status, message);
    this.sub = sub;
  }
}

export class ExprEvalError2Obj extends ExprEvalErrorObj {
  public readonly left: ExprEvalResult<unknown>;
  public readonly right: ExprEvalResult<unknown>;

  constructor(
    exprKind: ExprKind,
    left: ExprEvalResult<unknown>,
    right: ExprEvalResult<unknown>,
    status?: ExprEvalStatus,
    message?: any
  ) {
    super(exprKind, status, message);
    this.left = left;
    this.right = right;
  }
}

export function isExprEvalError(arg: any): arg is ExprEvalError {
  return isExprEvalStatus(arg.status) && arg.status >= ExprEvalStatus.ERROR;
}

export type ExprEvalError =
  | ExprEvalUnspecificError
  | ExprEvalReferencError
  | ExprEvalErrorUndefinedResult
  | ExprEvalMissingRequiredFunctionArgumentError
  | ExprEvalValueError<unknown>;

type ExprEvalUnspecificError = {
  readonly exprKind: ExprKind;
  readonly status: ExprEvalStatus;
  readonly message?: string;
};

export type ExprEvalReferencError = ExprEvalUnspecificError & {
  readonly status: ExprEvalStatus.REFERENCE_ERROR;
  readonly expr: Expr<unknown>;
};

export type ExprEvalConsequentialError1 = ExprEvalUnspecificError & {
  readonly status: ExprEvalStatus.CONSEQUENTIAL_ERROR;
  readonly exprKind: ExprKind;
  readonly cause: ExprEvalError;
};

export class ExprEvalConsequentialError1Obj extends ExprEvalErrorObj {
  public readonly exprKind: ExprKind;
  public readonly cause: ExprEvalResult<unknown>;

  constructor(
    exprKind: ExprKind,
    cause: ExprEvalResult<unknown>,
    message?: any
  ) {
    super(
      exprKind,
      ExprEvalStatus.CONSEQUENTIAL_ERROR,
      message || "Consequential error"
    );
    this.exprKind = exprKind;
    this.cause = cause;
  }
}

export type ExprEvalConsequentialError2 = ExprEvalUnspecificError & {
  readonly status: ExprEvalStatus.CONSEQUENTIAL_ERROR;
  readonly exprKind: ExprKind;
  readonly leftCause: ExprEvalResult<unknown>;
  readonly rightCause: ExprEvalResult<unknown>;
};

export class ExprEvalConsequentialError2Obj extends ExprEvalErrorObj {
  public readonly leftCause: ExprEvalResult<unknown>;
  public readonly rightCause: ExprEvalResult<unknown>;

  constructor(
    exprKind: ExprKind,
    leftCause: ExprEvalResult<unknown>,
    rightCause: ExprEvalResult<unknown>,
    message?: any
  ) {
    super(
      exprKind,
      ExprEvalStatus.CONSEQUENTIAL_ERROR,
      message || "Consequential error"
    );
    this.leftCause = leftCause;
    this.rightCause = rightCause;
  }
}

export type ExprEvalFunctionEvaluationError = ExprEvalUnspecificError & {
  functionName: string;
};

export type ExprEvalMissingRequiredFunctionArgumentError =
  ExprEvalFunctionEvaluationError & {
    argumentName: string;
    argumentIndex: number;
  };

export type ExprEvalFunctionEvaluationConsequentialError =
  ExprEvalFunctionEvaluationError & {
    cause: ExprEvalUnspecificError;
  };

export class ExprEvalFunctionEvaluationErrorObj extends ExprEvalErrorObj {
  public readonly functionName: string;

  constructor(
    exprKind: ExprKind,
    status: ExprEvalStatus,
    message: any,
    functionName: string
  ) {
    super(exprKind, status, message);
    this.functionName = functionName;
  }
}

export class ExprEvalFunctionEvaluationObjectNotFoundErrorObj extends ExprEvalFunctionEvaluationErrorObj {
  public readonly offendingKey: string;

  constructor(
    exprKind: ExprKind,
    status: ExprEvalStatus,
    message: any,
    functionName: string,
    objectKey: string
  ) {
    super(exprKind, status, message, functionName);
    this.offendingKey = objectKey;
  }
}

export class ExprEvalFunctionEvaluationConsequentialErrorObj extends ExprEvalFunctionEvaluationErrorObj {
  public readonly cause: ExprEvalError;

  constructor(exprKind: ExprKind, functionName: string, cause: ExprEvalError) {
    super(
      exprKind,
      ExprEvalStatus.CONSEQUENTIAL_ERROR,
      `Error evaluating function ${functionName}`,
      functionName
    );
    this.cause = cause;
  }
}

export class ExprEvalMissingRequiredFunctionArgumentErrorObj extends ExprEvalFunctionEvaluationErrorObj {
  public readonly argumentName: string;
  public readonly argumentIndex: number;

  constructor(
    exprKind: ExprKind,
    message: any,
    functionName: string,
    argumentName: string,
    argumentIndex: number
  ) {
    super(
      exprKind,
      ExprEvalStatus.MISSING_REQUIRED_FUNCTION_ARGUMENT,
      message,
      functionName
    );
    this.argumentName = argumentName;
    this.argumentIndex = argumentIndex;
  }
}

export type ExprEvalTypeError = ExprEvalUnspecificError & {
  status: ExprEvalStatus.TYPE_ERROR;
};

export type ExprEvalValueError<T> = ExprEvalUnspecificError & {
  offendingValue: T;
};

export class ExprEvalValueErrorObj<T> extends ExprEvalErrorObj {
  public readonly offendingValue: T;

  constructor(
    exprKind: ExprKind,
    status: ExprEvalStatus,
    message: any,
    offendingValue: T
  ) {
    super(exprKind, status, message);
    this.offendingValue = offendingValue;
  }
}

export class ExprEvalTypeErrorObj<T> extends ExprEvalValueErrorObj<T> {
  constructor(exprKind: ExprKind, message: any, offendingValue: T) {
    super(exprKind, ExprEvalStatus.TYPE_ERROR, message, offendingValue);
  }
}

export type ExprEvalParseError = ExprEvalUnspecificError & {
  exprKind: ExprKind.PARSE_ERROR;
  line: number;
  column: number;
  offendingInput: string;
};

export type ExprEvalValidationError = ExprEvalUnspecificError & {
  line: number;
  column: number;
  toLine?: number;
  toColumn?: number;
};

export class ExprEvalParseErrorObj extends ExprEvalErrorObj {
  public readonly line: number;
  public readonly column: number;
  public readonly offendingInput: string;

  constructor(
    status: ExprEvalStatus,
    message: any,
    line: number,
    column: number,
    offendingInput: string
  ) {
    super(ExprKind.PARSE_ERROR, status, message);
    this.line = line;
    this.column = column;
    this.offendingInput = offendingInput;
  }
}

export class ExprEvalValidationErrorObj extends ExprEvalErrorObj {
  public readonly line: number;
  public readonly toLine?: number;
  public readonly column: number;
  public readonly toColumn?: number;

  constructor(
    status: ExprEvalStatus,
    message: any,
    line: number,
    column: number,
    toLine?: number,
    toColumn?: number
  ) {
    super(ExprKind.PARSE_ERROR, status, message);
    this.line = line;
    this.toLine = toLine;
    this.column = column;
    this.toColumn = toColumn;
  }
}

export class ExprEvalUnknownFunctionErrorObj extends ExprEvalValidationErrorObj {
  public readonly functionName: string;

  constructor(
    message: any,
    line: number,
    column: number,
    functionName,
    toLine?: number,
    toColumn?: number
  ) {
    super(
      ExprEvalStatus.UNKNOWN_FUNCTION,
      message,
      line,
      column,
      toLine,
      toColumn
    );
    this.functionName = functionName;
  }
}

export class ExprEvalMissingFunctionArgumentErrorObj extends ExprEvalValidationErrorObj {
  public readonly functionName: string;
  public readonly argumentName: string;
  public readonly argumentIndex: number;

  constructor(
    message: any,
    line: number,
    column: number,
    functionName: string,
    argumentName: string,
    argumentIndex: number,
    toLine?: number,
    toColumn?: number
  ) {
    super(
      ExprEvalStatus.MISSING_REQUIRED_FUNCTION_ARGUMENT,
      message,
      line,
      column,
      toLine,
      toColumn
    );
    this.functionName = functionName;
    this.argumentName = argumentName;
    this.argumentIndex = argumentIndex;
  }
}

export class ExprEvalWrongFunctionArgumentTypeErrorObj extends ExprEvalValidationErrorObj {
  public readonly functionName: string;
  public readonly argumentName: string;
  public readonly argumentIndex: number;
  public readonly expectedType: string;
  public readonly actualType: string;

  constructor(
    message: any,
    line: number,
    column: number,
    functionName: string,
    argumentName: string,
    argumentIndex: number,
    expectedType: string,
    actualType: string,
    toLine?: number,
    toColumn?: number
  ) {
    super(
      ExprEvalStatus.WRONG_FUNCTION_ARGUMENT_TYPE,
      message,
      line,
      column,
      toLine,
      toColumn
    );
    this.functionName = functionName;
    this.argumentName = argumentName;
    this.argumentIndex = argumentIndex;
    this.expectedType = expectedType;
    this.actualType = actualType;
  }
}
