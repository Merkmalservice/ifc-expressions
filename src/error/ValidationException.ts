import { ParserRuleContext } from "antlr4";

export class ValidationException extends Error {
  public readonly fromLine: number;
  public readonly toLine: number;
  public readonly fromColumn: number;
  public readonly toColumn: number;

  constructor(message: string, ctx: ParserRuleContext) {
    super(
      `Validation Failed: ${message} at ${ValidationException.makeColumnsString(
        ctx
      )}, near '${ctx.getText()}'`
    );
    this.fromLine = ctx.start.line;
    this.fromColumn = ctx.start.start;
    this.toLine = ctx.stop.line;
    this.toColumn = ctx.stop.stop;
  }

  private static makeColumnsString(ctx: ParserRuleContext): string {
    const fromLine = ctx.start.line;
    const fromColumn = ctx.start.start;
    const toLine = ctx.stop.line;
    const toColumn = ctx.stop.stop;
    if (fromLine == toLine) {
      return fromColumn == toColumn
        ? `line ${fromLine}, column ${fromColumn}`
        : `line ${fromLine}, columns ${fromColumn}-${toColumn}`;
    } else {
      return `line ${fromLine}, column ${fromColumn} to line ${toLine}, column ${toColumn}`;
    }
  }
}
