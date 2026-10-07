import {
  ExprEvalError,
  ExprEvalErrorObj,
  ExprEvalStatus,
} from "../expression/ExprEvalResult.js";
import { SyntaxErrorException } from "./SyntaxErrorException.js";
import { SyntaxErrorMapper } from "./mapper/SyntaxErrorMapper.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { ExprKind } from "../expression/ExprKind.js";
import { MissingFunctionArgumentExceptionMapper } from "./mapper/MissingFunctionArgumentExceptionMapper.js";
import { NoSuchFunctionExceptionMapper } from "./mapper/NoSuchFunctionExceptionMapper.js";
import { ExpressionTypeError } from "./ExpressionTypeError.js";
import { MissingFunctionArgumentException } from "./MissingFunctionArgumentException.js";
import { NoSuchFunctionException } from "./NoSuchFunctionException.js";
import { NoSuchMethodException } from "./NoSuchMethodException.js";
import { WrongFunctionArgumentTypeException } from "./WrongFunctionArgumentTypeException.js";
import { WrongFunctionArgumentTypeExceptionMapper } from "./mapper/WrongFunctionArgumentTypeExceptionMapper.js";
import { InvalidSyntaxException } from "./InvalidSyntaxException.js";
import { ValidationExceptionMapper } from "./mapper/ValidationExceptionMapper.js";
import { ValidationException } from "./ValidationException.js";
import { SpuriousFunctionArgumentExceptionMapper } from "./mapper/SpuriousFunctionArgumentExceptionMapper.js";
import { SpuriousFunctionArgumentException } from "./SpuriousFunctionArgumentException.js";

export interface ExceptionToExprEvalErrorMapper<T extends Error> {
  mapException(exception: T): ExprEvalError;
}

const mappers = new Map<string, ExceptionToExprEvalErrorMapper<Error>>();
mappers.set(SyntaxErrorException.name, new SyntaxErrorMapper());
mappers.set(ValidationException.name, new ValidationExceptionMapper());
mappers.set(ExpressionTypeError.name, mappers.get(ValidationException.name));
mappers.set(
  MissingFunctionArgumentException.name,
  new MissingFunctionArgumentExceptionMapper()
);
mappers.set(
  SpuriousFunctionArgumentException.name,
  new SpuriousFunctionArgumentExceptionMapper()
);
mappers.set(NoSuchFunctionException.name, new NoSuchFunctionExceptionMapper());
mappers.set(
  NoSuchMethodException.name,
  mappers.get(NoSuchFunctionException.name)
);
mappers.set(
  WrongFunctionArgumentTypeException.name,
  new WrongFunctionArgumentTypeExceptionMapper()
);
mappers.set(InvalidSyntaxException.name, mappers.get(ValidationException.name));

export function mapException(e: Error): ExprEvalError {
  const mapper = mappers.get(e.constructor.name);
  if (isNullish(mapper)) {
    return new ExprEvalErrorObj(
      ExprKind.PARSE_ERROR,
      ExprEvalStatus.ERROR,
      e.message,
      this.getTextSpan()
    );
  }
  return mapper.mapException(e);
}
