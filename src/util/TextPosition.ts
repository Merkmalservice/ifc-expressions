export class TextPosition {
  private readonly _line: number;
  private readonly _column: number;

  constructor(line: number, column: number) {
    this._line = line;
    this._column = column;
    if (this._line < 1 || this._column < 1) {
      throw new Error(
        `Cannot create text position ${this.toString()}. Text positions are 1-based. No line or column values below 1 are allowed.`
      );
    }
  }

  static of(line: number, column: number): TextPosition {
    return new TextPosition(line, column);
  }

  toString() {
    return this._line + ":" + this._column;
  }

  get line(): number {
    return this._line;
  }

  get column(): number {
    return this._column;
  }

  public isFirstLine(): boolean {
    return this._line === 1;
  }

  public isFirstColumn(): boolean {
    return this._column === 1;
  }

  public isAtBeginning(): boolean {
    return this.isFirstLine() && this.isFirstColumn();
  }

  isAtSameLine(other: TextPosition): boolean {
    return this._line === other?._line;
  }

  isAtSameColumn(other: TextPosition): boolean {
    return this.column === other?.column;
  }

  isBefore(other: TextPosition): boolean {
    const linediff = this._line - other._line;
    return linediff < 0 || (linediff === 0 && this._column < other._column);
  }
}
