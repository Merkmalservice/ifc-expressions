import { isPresent } from "../util/IfcExpressionUtils.js";

export class SyntaxErrorException extends Error {
  private readonly _offendingSymbol: string | number;
  private readonly _line: number;
  private readonly _column: number;

  constructor(
    offendingSymbol: string | number,
    line: number,
    column: number,
    msg: string
  ) {
    super(
      `Syntax Error in line ${line}, column ${column}` +
        (isPresent(msg) ? `: ${msg}` : "")
    );
    this._offendingSymbol = offendingSymbol;
    this._line = line;
    this._column = column;
  }

  get offendingSymbol(): string | number {
    return this._offendingSymbol;
  }

  get line(): number {
    return this._line;
  }

  get column(): number {
    return this._column;
  }
}
