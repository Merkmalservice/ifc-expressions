import { Token } from "antlr4";
import { notNullish } from "./utils";

export class SyntaxErrorException extends Error {
  private readonly _offendingSymbol: Token;
  private readonly _line: number;
  private readonly _column: number;

  constructor(
    offendingSymbol: Token,
    line: number,
    column: number,
    msg: string
  ) {
    super(
      `Syntax Error in line ${line}, column ${column}` +
        (notNullish(msg) ? `: ${msg}` : "")
    );
    this._offendingSymbol = offendingSymbol;
    this._line = line;
    this._column = column;
  }

  get offendingSymbol(): Token {
    return this._offendingSymbol;
  }

  get line(): number {
    return this._line;
  }

  get column(): number {
    return this._column;
  }
}
