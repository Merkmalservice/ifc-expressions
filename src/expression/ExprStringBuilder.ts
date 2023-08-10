import { Expr } from "./Expr.js";

export class ExprStringBuilder {
  private readonly product: Array<String> = [];
  private _startPos: number;
  private _endPos: number;

  constructor(startPos: number) {
    this._startPos = startPos;
    this._endPos = startPos;
  }

  public appendString(s: string): ExprStringBuilder {
    this.product.push(s);
    this._endPos = this._endPos + s.length;
    return this;
  }

  public appendExpr(expr: Expr<any>): ExprStringBuilder {
    expr.toExprString(this);
    return this;
  }

  public appendExprArray(exprs: Array<Expr<any>>, separator = ",") {
    for (let i = 0; i < exprs.length; i++) {
      this.appendExpr(exprs[i]);
      if (i < exprs.length - 1) {
        this.appendString(separator);
      }
    }
    return this;
  }

  public build(): string {
    return this.product.join("");
  }

  get endPos(): number {
    return this._endPos;
  }

  get startPos(): number {
    return this._startPos;
  }
}
