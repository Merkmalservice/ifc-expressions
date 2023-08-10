import { TextPosition } from "./TextPosition.js";
import { isNullish } from "./IfcExpressionUtils.js";

export class TextSpan {
  private _start: TextPosition;
  private _end: TextPosition;

  constructor(start: TextPosition, end: TextPosition) {
    if (start.isBefore(end)) {
      this._start = start;
      this._end = end;
    } else {
      this._start = end;
      this._end = start;
    }
  }

  static of(
    fromLine: number,
    fromColumn: number,
    toLine: number,
    toColumn: number
  ) {
    return new TextSpan(
      new TextPosition(fromLine, fromColumn),
      new TextPosition(toLine, toColumn)
    );
  }

  get start(): TextPosition {
    return this._start;
  }

  get end(): TextPosition {
    return this._end;
  }

  toString(): string {
    return this._start.toString() + " -  " + this._end.toString();
  }

  public getCoveredText(input: string) {
    if (
      this._start.isFirstLine() &&
      this._end.isFirstLine() &&
      this.end.column <= input.length
    ) {
      return input.substr(this._start.column - 1, this._end.column - 1);
    }
    const lines = input.split("\n");
    if (lines.length > this._end.line) {
      // this is correct: _end.line is 1-based, so if there are 3 lines, length is 3 and the last TextPosition is line is line 3, col x.
      throw new Error(
        `Cannot compute covered text. End position ${this._end.toString()} is past the number of lines in the text (${
          lines.length
        })`
      );
    }
    if (
      lines.length == this.end.line &&
      lines[lines.length - 1].length > this._end.column
    ) {
      throw new Error(
        `Cannot compute covered text. End position ${this._end.toString()} is past the last position in the last column in the last line of the text (${
          lines.length
        }:${lines[lines.length - 1].length})`
      );
    }
    if (this._start.isAtSameLine(this._end)) {
      return lines[this.start.line - 1].substr(
        this._start.column - 1,
        this._end.column - 1
      );
    }
    let result = "";
    let copying = false;
    for (let line = this._start.line; line <= this.end.line; line++) {
      if (line === this._start.line) {
        result += lines[line - 1].substr(this.start.column - 1);
        copying = true;
      } else if (line === this._end.line) {
        result += lines[line - 1].substr(0, this.end.column - 1);
        return result;
      } else if (copying) {
        result += lines[line - 1];
      }
    }
    throw new Error(
      "Cannot compute text coverage, this should not have happened. There is a bug in the sanity checks for the start and end positions."
    );
  }

  public underline(input: string, underlineChar: string = "~"): string {
    const lines = input.split("\n");
    if (lines.length < this._end.line) {
      // this is correct: _end.line is 1-based, so if there are 3 lines, length is 3 and the last TextPosition is line is line 3, col x.
      throw new Error(
        `Cannot compute covered text. End position ${this._end.toString()} is past the number of lines in the text (${
          lines.length
        })`
      );
    }
    if (
      lines.length == this.end.line &&
      lines[lines.length - 1].length + 1 < this._end.column
    ) {
      //tolerate a one-off error as the antlr4 syntax error is sometimes at index 0, sometimes at index [length].
      throw new Error(
        `Cannot compute covered text. End position ${this._end.toString()} is past the last position in the last column in the last line of the text (${
          lines.length
        }:${lines[lines.length - 1].length})`
      );
    }
    let result = [];
    let underlining = false;
    for (let line = 1; line <= lines.length; line++) {
      if (line === this._start.line && line === this._end.line) {
        result.push(
          ...this.underlineOneLine(
            lines[line - 1],
            underlineChar,
            this.start.column - 1,
            this._end.column - this._start.column + 1
          )
        );
      } else if (line === this._start.line) {
        result.push(
          ...this.underlineOneLine(
            lines[line - 1],
            underlineChar,
            this.start.column - 1
          )
        );
        underlining = true;
      } else if (line === this._end.line) {
        result.push(
          ...this.underlineOneLine(
            lines[line - 1],
            underlineChar,
            0,
            this.end.column
          )
        );
        underlining = false;
      } else {
        if (underlining) {
          result.push(...this.underlineOneLine(lines[line - 1], underlineChar));
        } else {
          result.push(lines[line - 1]);
        }
      }
    }
    return result.join("\n");
    throw new Error(
      "Cannot compute text coverage, this should not have happened. There is a bug in the sanity checks for the start and end positions."
    );
  }

  private underlineOneLine(
    line: string,
    ulChar: string = "~",
    ulStart: number = 0,
    ulLength: number = line.length - ulStart
  ): Array<string> {
    if (ulChar.length != 1) {
      throw new Error(
        `Underline char must be a string of length 1, ${ulChar} does not qualify`
      );
    }
    if (ulLength <= 0) {
      ulLength = 1;
    }
    return [line, " ".repeat(ulStart) + ulChar.repeat(ulLength)];
  }
}
