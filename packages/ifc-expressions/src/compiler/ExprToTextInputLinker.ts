import { ExprVisitor } from "../postprocess/ExprVisitor.js";
import { ExprManager } from "./ExprManager.js";
import { Expr } from "../expression/Expr.js";
import { TextSpan } from "../util/TextSpan.js";
import { ExprWalker } from "../postprocess/ExprWalker.js";

export class ExprToTextInputLinker extends ExprVisitor {
  private exprManager: ExprManager;
  private input: string;

  constructor(input: string, exprManager: ExprManager) {
    super();
    this.exprManager = exprManager;
    this.input = input;
  }

  static linkTextToExpressions(
    input: string,
    expr: Expr<any>,
    exprManager: ExprManager
  ) {
    const visitor = new ExprToTextInputLinker(input, exprManager);
    const walker = new ExprWalker(visitor);
    walker.walk(expr);
  }

  enterExpr(expr: Expr<any>) {
    const parserRuleContext = this.exprManager.getContext(expr);
    // @ts-ignore
    // @ts-ignore
    const textSpan = TextSpan.of(
      parserRuleContext.start.line,
      parserRuleContext.start.column + 1,
      parserRuleContext.stop.line,
      parserRuleContext.stop.column + (parserRuleContext.stop.text || "").length
    );
    expr.setTextSpan(textSpan);
  }
}
