import {Expr} from "./Expr";
import {ExprKind} from "./ExprKind";
import {isNullish} from "../IfcExpressionUtils";

export enum ExprEvalStatus {
  SUCCESS = 1000,
  ERROR = 2000,
  UNDEFINED_RESULT = 2001,
  REFERENCE_ERROR = 2010,
  MISSING_OPERAND,
  CONSEQUENTIAL_ERROR = 2020,
  MATH_ERROR = 2030,
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

export class ExprEvalRefChainErrorObj extends ExprEvalErrorObj {
  public readonly errorPathElement: string;
  public readonly path: Array<string>;

  constructor(
    exprKind: ExprKind,
    status: ExprEvalStatus,
    errorPathElement: string,
    message?: any
  ) {
    super(exprKind, status, message);
    this.errorPathElement = errorPathElement;
    this.path = [errorPathElement];
  }

  public static bubbleUp(
    error: ExprEvalRefChainError,
    currentPathElement
  ): ExprEvalRefChainError {
    return {
      exprKind: error.exprKind,
      status: error.status,
      errorPathElement: error.errorPathElement,
      path: [currentPathElement, ...error.path],
      message: error.message,
    };
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

export type ExprEvalError = {
  readonly exprKind: ExprKind;
  readonly status: ExprEvalStatus;
  readonly message?: string;
} & ({} | ExprEvalReferencError | ExprEvalErrorUndefinedResult);

export type ExprEvalRefChainError = ExprEvalError & {
  readonly errorPathElement: string;
  readonly path: Array<string>;
};

export function isExprEvalRefChainError(
  arg: any
): arg is ExprEvalRefChainError {
  return (
    isExprEvalStatus(arg.status) &&
    arg.status >= ExprEvalStatus.ERROR &&
    Array.isArray(arg.path) &&
    typeof arg.errorPathElement === "string"
  );
}

export type ExprEvalReferencError = {
  readonly status: ExprEvalStatus.REFERENCE_ERROR;
  readonly expr: Expr<unknown>;
};

export type ExprEvalConsequentialError1 = ExprEvalError & {
  readonly status: ExprEvalStatus.CONSEQUENTIAL_ERROR;
  readonly exprKind: ExprKind;
  readonly sub: ExprEvalError;
};

export class ExprEvalConsequentialError1Obj extends ExprEvalErrorObj {
  public readonly exprKind: ExprKind;
  public readonly sub: ExprEvalResult<unknown>;

  constructor(exprKind: ExprKind, sub: ExprEvalResult<unknown>, message?: any) {
    super(
      exprKind,
      ExprEvalStatus.CONSEQUENTIAL_ERROR,
      message || "Consequential error"
    );
    this.exprKind = exprKind;
    this.sub = sub;
  }
}

export type ExprEvalConsequentialError2 = ExprEvalError & {
  readonly status: ExprEvalStatus.CONSEQUENTIAL_ERROR;
  readonly exprKind: ExprKind;
  readonly left: ExprEvalResult<unknown>;
  readonly right: ExprEvalResult<unknown>;
};

export class ExprEvalConsequentialError2Obj extends ExprEvalErrorObj {
  public readonly left: ExprEvalResult<unknown>;
  public readonly right: ExprEvalResult<unknown>;

  constructor(
    exprKind: ExprKind,
    left: ExprEvalResult<unknown>,
    right: ExprEvalResult<unknown>,
    message?: any
  ) {
    super(
      exprKind,
      ExprEvalStatus.CONSEQUENTIAL_ERROR,
      message || "Consequential error"
    );
    this.left = left;
    this.right = right;
  }
}
