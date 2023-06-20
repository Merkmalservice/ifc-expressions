// Generated from IfcExpression.g4 by ANTLR 4.13.0
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
  ATN,
  ATNDeserializer,
  DecisionState,
  DFA,
  FailedPredicateException,
  RecognitionException,
  NoViableAltException,
  BailErrorStrategy,
  Parser,
  ParserATNSimulator,
  RuleContext,
  ParserRuleContext,
  PredictionMode,
  PredictionContextCache,
  TerminalNode,
  RuleNode,
  Token,
  TokenStream,
  Interval,
  IntervalSet,
} from "antlr4";
import IfcExpressionListener from "./IfcExpressionListener.js";
import IfcExpressionVisitor from "./IfcExpressionVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class IfcExpressionParser extends Parser {
  public static readonly T__0 = 1;
  public static readonly T__1 = 2;
  public static readonly T__2 = 3;
  public static readonly T__3 = 4;
  public static readonly T__4 = 5;
  public static readonly T__5 = 6;
  public static readonly T__6 = 7;
  public static readonly T__7 = 8;
  public static readonly T__8 = 9;
  public static readonly T__9 = 10;
  public static readonly T__10 = 11;
  public static readonly INT = 12;
  public static readonly FLOAT = 13;
  public static readonly PROP = 14;
  public static readonly ELEM = 15;
  public static readonly RESERVED_ATTRIBUTE_NAME = 16;
  public static readonly RESERVED_RELATION_NAME = 17;
  public static readonly QUOTED_STRING = 18;
  public static readonly BRACKETED_STRING = 19;
  public static readonly IDENTIFIER = 20;
  public static readonly WS = 21;
  public static readonly NEWLINE = 22;
  public static readonly EOF = Token.EOF;
  public static readonly RULE_expr = 0;
  public static readonly RULE_numExpr = 1;
  public static readonly RULE_numLiteral = 2;
  public static readonly RULE_stringExpr = 3;
  public static readonly RULE_objectRef = 4;
  public static readonly RULE_attributeRef = 5;
  public static readonly RULE_nestedObjectChain = 6;
  public static readonly RULE_namedRef = 7;
  public static readonly RULE_functionCall = 8;
  public static readonly RULE_exprList = 9;
  public static readonly RULE_array = 10;
  public static readonly RULE_arrayElementList = 11;
  public static readonly literalNames: (string | null)[] = [
    null,
    "'*'",
    "'/'",
    "'+'",
    "'-'",
    "'('",
    "')'",
    "'.'",
    "'@'",
    "','",
    "'['",
    "']'",
  ];
  public static readonly symbolicNames: (string | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "INT",
    "FLOAT",
    "PROP",
    "ELEM",
    "RESERVED_ATTRIBUTE_NAME",
    "RESERVED_RELATION_NAME",
    "QUOTED_STRING",
    "BRACKETED_STRING",
    "IDENTIFIER",
    "WS",
    "NEWLINE",
  ];
  // tslint:disable:no-trailing-whitespace
  public static readonly ruleNames: string[] = [
    "expr",
    "numExpr",
    "numLiteral",
    "stringExpr",
    "objectRef",
    "attributeRef",
    "nestedObjectChain",
    "namedRef",
    "functionCall",
    "exprList",
    "array",
    "arrayElementList",
  ];
  public get grammarFileName(): string {
    return "IfcExpression.g4";
  }
  public get literalNames(): (string | null)[] {
    return IfcExpressionParser.literalNames;
  }
  public get symbolicNames(): (string | null)[] {
    return IfcExpressionParser.symbolicNames;
  }
  public get ruleNames(): string[] {
    return IfcExpressionParser.ruleNames;
  }
  public get serializedATN(): number[] {
    return IfcExpressionParser._serializedATN;
  }

  protected createFailedPredicateException(
    predicate?: string,
    message?: string
  ): FailedPredicateException {
    return new FailedPredicateException(this, predicate, message);
  }

  constructor(input: TokenStream) {
    super(input);
    this._interp = new ParserATNSimulator(
      this,
      IfcExpressionParser._ATN,
      IfcExpressionParser.DecisionsToDFA,
      new PredictionContextCache()
    );
  }
  // @RuleVersion(0)
  public expr(): ExprContext {
    let localctx: ExprContext = new ExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, IfcExpressionParser.RULE_expr);
    try {
      this.state = 29;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 0, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 24;
            this.attributeRef();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 25;
            this.functionCall();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 26;
            this.numExpr(0);
          }
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          {
            this.state = 27;
            this.array();
          }
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          {
            this.state = 28;
            this.stringExpr(0);
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public numExpr(): NumExprContext;
  public numExpr(_p: number): NumExprContext;
  // @RuleVersion(0)
  public numExpr(_p?: number): NumExprContext {
    if (_p === undefined) {
      _p = 0;
    }

    let _parentctx: ParserRuleContext = this._ctx;
    let _parentState: number = this.state;
    let localctx: NumExprContext = new NumExprContext(
      this,
      this._ctx,
      _parentState
    );
    let _prevctx: NumExprContext = localctx;
    let _startState: number = 2;
    this.enterRecursionRule(localctx, 2, IfcExpressionParser.RULE_numExpr, _p);
    let _la: number;
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 39;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 12:
          case 13:
            {
              localctx = new NumLitContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;

              this.state = 32;
              this.numLiteral();
            }
            break;
          case 5:
            {
              localctx = new NumParensContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;
              this.state = 33;
              this.match(IfcExpressionParser.T__4);
              this.state = 34;
              this.numExpr(0);
              this.state = 35;
              this.match(IfcExpressionParser.T__5);
            }
            break;
          case 20:
            {
              localctx = new NumFunCallContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;
              this.state = 37;
              this.functionCall();
            }
            break;
          case 14:
          case 15:
            {
              localctx = new NumAttributeRefContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;
              this.state = 38;
              this.attributeRef();
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 49;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              this.state = 47;
              this._errHandler.sync(this);
              switch (this._interp.adaptivePredict(this._input, 2, this._ctx)) {
                case 1:
                  {
                    localctx = new NumMulDivContext(
                      this,
                      new NumExprContext(this, _parentctx, _parentState)
                    );
                    this.pushNewRecursionContext(
                      localctx,
                      _startState,
                      IfcExpressionParser.RULE_numExpr
                    );
                    this.state = 41;
                    if (!this.precpred(this._ctx, 6)) {
                      throw this.createFailedPredicateException(
                        "this.precpred(this._ctx, 6)"
                      );
                    }
                    this.state = 42;
                    (localctx as NumMulDivContext)._op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if (!(_la === 1 || _la === 2)) {
                      (localctx as NumMulDivContext)._op =
                        this._errHandler.recoverInline(this);
                    } else {
                      this._errHandler.reportMatch(this);
                      this.consume();
                    }
                    this.state = 43;
                    this.numExpr(7);
                  }
                  break;
                case 2:
                  {
                    localctx = new NumAddSubContext(
                      this,
                      new NumExprContext(this, _parentctx, _parentState)
                    );
                    this.pushNewRecursionContext(
                      localctx,
                      _startState,
                      IfcExpressionParser.RULE_numExpr
                    );
                    this.state = 44;
                    if (!this.precpred(this._ctx, 5)) {
                      throw this.createFailedPredicateException(
                        "this.precpred(this._ctx, 5)"
                      );
                    }
                    this.state = 45;
                    (localctx as NumAddSubContext)._op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if (!(_la === 3 || _la === 4)) {
                      (localctx as NumAddSubContext)._op =
                        this._errHandler.recoverInline(this);
                    } else {
                      this._errHandler.reportMatch(this);
                      this.consume();
                    }
                    this.state = 46;
                    this.numExpr(6);
                  }
                  break;
              }
            }
          }
          this.state = 51;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  // @RuleVersion(0)
  public numLiteral(): NumLiteralContext {
    let localctx: NumLiteralContext = new NumLiteralContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 4, IfcExpressionParser.RULE_numLiteral);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 52;
        _la = this._input.LA(1);
        if (!(_la === 12 || _la === 13)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public stringExpr(): StringExprContext;
  public stringExpr(_p: number): StringExprContext;
  // @RuleVersion(0)
  public stringExpr(_p?: number): StringExprContext {
    if (_p === undefined) {
      _p = 0;
    }

    let _parentctx: ParserRuleContext = this._ctx;
    let _parentState: number = this.state;
    let localctx: StringExprContext = new StringExprContext(
      this,
      this._ctx,
      _parentState
    );
    let _prevctx: StringExprContext = localctx;
    let _startState: number = 6;
    this.enterRecursionRule(
      localctx,
      6,
      IfcExpressionParser.RULE_stringExpr,
      _p
    );
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 58;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 18:
            {
              localctx = new StringLiteralContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;

              this.state = 55;
              this.match(IfcExpressionParser.QUOTED_STRING);
            }
            break;
          case 20:
            {
              localctx = new StringFunCallContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;
              this.state = 56;
              this.functionCall();
            }
            break;
          case 14:
          case 15:
            {
              localctx = new StringAttributeRefContext(this, localctx);
              this._ctx = localctx;
              _prevctx = localctx;
              this.state = 57;
              this.attributeRef();
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 65;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 5, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              {
                localctx = new StringConcatContext(
                  this,
                  new StringExprContext(this, _parentctx, _parentState)
                );
                (localctx as StringConcatContext)._left = _prevctx;
                this.pushNewRecursionContext(
                  localctx,
                  _startState,
                  IfcExpressionParser.RULE_stringExpr
                );
                this.state = 60;
                if (!this.precpred(this._ctx, 3)) {
                  throw this.createFailedPredicateException(
                    "this.precpred(this._ctx, 3)"
                  );
                }
                this.state = 61;
                this.match(IfcExpressionParser.T__2);
                this.state = 62;
                (localctx as StringConcatContext)._right = this.stringExpr(4);
              }
            }
          }
          this.state = 67;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 5, this._ctx);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  // @RuleVersion(0)
  public objectRef(): ObjectRefContext {
    let localctx: ObjectRefContext = new ObjectRefContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 8, IfcExpressionParser.RULE_objectRef);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 68;
        _la = this._input.LA(1);
        if (!(_la === 14 || _la === 15)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public attributeRef(): AttributeRefContext {
    let localctx: AttributeRefContext = new AttributeRefContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 10, IfcExpressionParser.RULE_attributeRef);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 70;
        this.objectRef();
        this.state = 71;
        this.nestedObjectChain();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public nestedObjectChain(): NestedObjectChainContext {
    let localctx: NestedObjectChainContext = new NestedObjectChainContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 12, IfcExpressionParser.RULE_nestedObjectChain);
    try {
      this.state = 79;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 7:
          localctx = new NestedObjectChainInnerContext(this, localctx);
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 73;
            this.match(IfcExpressionParser.T__6);
            this.state = 74;
            this.namedRef();
            this.state = 75;
            this.nestedObjectChain();
          }
          break;
        case 8:
          localctx = new NestedObjectChainEndContext(this, localctx);
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 77;
            this.match(IfcExpressionParser.T__7);
            this.state = 78;
            (localctx as NestedObjectChainEndContext)._name = this.match(
              IfcExpressionParser.RESERVED_ATTRIBUTE_NAME
            );
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public namedRef(): NamedRefContext {
    let localctx: NamedRefContext = new NamedRefContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 14, IfcExpressionParser.RULE_namedRef);
    try {
      this.state = 84;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 17:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 81;
            localctx._name = this.match(
              IfcExpressionParser.RESERVED_RELATION_NAME
            );
          }
          break;
        case 19:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 82;
            localctx._name = this.match(IfcExpressionParser.BRACKETED_STRING);
          }
          break;
        case 20:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 83;
            localctx._name = this.match(IfcExpressionParser.IDENTIFIER);
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public functionCall(): FunctionCallContext {
    let localctx: FunctionCallContext = new FunctionCallContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 16, IfcExpressionParser.RULE_functionCall);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 86;
        localctx._name = this.match(IfcExpressionParser.IDENTIFIER);
        this.state = 87;
        this.match(IfcExpressionParser.T__4);
        this.state = 88;
        this.exprList();
        this.state = 89;
        this.match(IfcExpressionParser.T__5);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public exprList(): ExprListContext {
    let localctx: ExprListContext = new ExprListContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 18, IfcExpressionParser.RULE_exprList);
    try {
      this.state = 96;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 8, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 91;
            this.expr();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 92;
            this.expr();
            this.state = 93;
            this.match(IfcExpressionParser.T__8);
            this.state = 94;
            this.exprList();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public array(): ArrayContext {
    let localctx: ArrayContext = new ArrayContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, IfcExpressionParser.RULE_array);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 98;
        this.match(IfcExpressionParser.T__9);
        this.state = 99;
        this.arrayElementList();
        this.state = 100;
        this.match(IfcExpressionParser.T__10);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public arrayElementList(): ArrayElementListContext {
    let localctx: ArrayElementListContext = new ArrayElementListContext(
      this,
      this._ctx,
      this.state
    );
    this.enterRule(localctx, 22, IfcExpressionParser.RULE_arrayElementList);
    try {
      this.state = 107;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 9, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 102;
            this.expr();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 103;
            this.expr();
            this.state = 104;
            this.match(IfcExpressionParser.T__8);
            this.state = 105;
            this.arrayElementList();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public sempred(
    localctx: RuleContext,
    ruleIndex: number,
    predIndex: number
  ): boolean {
    switch (ruleIndex) {
      case 1:
        return this.numExpr_sempred(localctx as NumExprContext, predIndex);
      case 3:
        return this.stringExpr_sempred(
          localctx as StringExprContext,
          predIndex
        );
    }
    return true;
  }
  private numExpr_sempred(
    localctx: NumExprContext,
    predIndex: number
  ): boolean {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 6);
      case 1:
        return this.precpred(this._ctx, 5);
    }
    return true;
  }
  private stringExpr_sempred(
    localctx: StringExprContext,
    predIndex: number
  ): boolean {
    switch (predIndex) {
      case 2:
        return this.precpred(this._ctx, 3);
    }
    return true;
  }

  public static readonly _serializedATN: number[] = [
    4, 1, 22, 110, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4,
    2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2,
    11, 7, 11, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3, 0, 30, 8, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 40, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 5, 1, 48, 8, 1, 10, 1, 12, 1, 51, 9, 1, 1, 2, 1, 2, 1, 3, 1, 3, 1, 3,
    1, 3, 3, 3, 59, 8, 3, 1, 3, 1, 3, 1, 3, 5, 3, 64, 8, 3, 10, 3, 12, 3, 67, 9,
    3, 1, 4, 1, 4, 1, 5, 1, 5, 1, 5, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 3, 6,
    80, 8, 6, 1, 7, 1, 7, 1, 7, 3, 7, 85, 8, 7, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1,
    9, 1, 9, 1, 9, 1, 9, 1, 9, 3, 9, 97, 8, 9, 1, 10, 1, 10, 1, 10, 1, 10, 1,
    11, 1, 11, 1, 11, 1, 11, 1, 11, 3, 11, 108, 8, 11, 1, 11, 0, 2, 2, 6, 12, 0,
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 4, 1, 0, 1, 2, 1, 0, 3, 4, 1, 0,
    12, 13, 1, 0, 14, 15, 114, 0, 29, 1, 0, 0, 0, 2, 39, 1, 0, 0, 0, 4, 52, 1,
    0, 0, 0, 6, 58, 1, 0, 0, 0, 8, 68, 1, 0, 0, 0, 10, 70, 1, 0, 0, 0, 12, 79,
    1, 0, 0, 0, 14, 84, 1, 0, 0, 0, 16, 86, 1, 0, 0, 0, 18, 96, 1, 0, 0, 0, 20,
    98, 1, 0, 0, 0, 22, 107, 1, 0, 0, 0, 24, 30, 3, 10, 5, 0, 25, 30, 3, 16, 8,
    0, 26, 30, 3, 2, 1, 0, 27, 30, 3, 20, 10, 0, 28, 30, 3, 6, 3, 0, 29, 24, 1,
    0, 0, 0, 29, 25, 1, 0, 0, 0, 29, 26, 1, 0, 0, 0, 29, 27, 1, 0, 0, 0, 29, 28,
    1, 0, 0, 0, 30, 1, 1, 0, 0, 0, 31, 32, 6, 1, -1, 0, 32, 40, 3, 4, 2, 0, 33,
    34, 5, 5, 0, 0, 34, 35, 3, 2, 1, 0, 35, 36, 5, 6, 0, 0, 36, 40, 1, 0, 0, 0,
    37, 40, 3, 16, 8, 0, 38, 40, 3, 10, 5, 0, 39, 31, 1, 0, 0, 0, 39, 33, 1, 0,
    0, 0, 39, 37, 1, 0, 0, 0, 39, 38, 1, 0, 0, 0, 40, 49, 1, 0, 0, 0, 41, 42,
    10, 6, 0, 0, 42, 43, 7, 0, 0, 0, 43, 48, 3, 2, 1, 7, 44, 45, 10, 5, 0, 0,
    45, 46, 7, 1, 0, 0, 46, 48, 3, 2, 1, 6, 47, 41, 1, 0, 0, 0, 47, 44, 1, 0, 0,
    0, 48, 51, 1, 0, 0, 0, 49, 47, 1, 0, 0, 0, 49, 50, 1, 0, 0, 0, 50, 3, 1, 0,
    0, 0, 51, 49, 1, 0, 0, 0, 52, 53, 7, 2, 0, 0, 53, 5, 1, 0, 0, 0, 54, 55, 6,
    3, -1, 0, 55, 59, 5, 18, 0, 0, 56, 59, 3, 16, 8, 0, 57, 59, 3, 10, 5, 0, 58,
    54, 1, 0, 0, 0, 58, 56, 1, 0, 0, 0, 58, 57, 1, 0, 0, 0, 59, 65, 1, 0, 0, 0,
    60, 61, 10, 3, 0, 0, 61, 62, 5, 3, 0, 0, 62, 64, 3, 6, 3, 4, 63, 60, 1, 0,
    0, 0, 64, 67, 1, 0, 0, 0, 65, 63, 1, 0, 0, 0, 65, 66, 1, 0, 0, 0, 66, 7, 1,
    0, 0, 0, 67, 65, 1, 0, 0, 0, 68, 69, 7, 3, 0, 0, 69, 9, 1, 0, 0, 0, 70, 71,
    3, 8, 4, 0, 71, 72, 3, 12, 6, 0, 72, 11, 1, 0, 0, 0, 73, 74, 5, 7, 0, 0, 74,
    75, 3, 14, 7, 0, 75, 76, 3, 12, 6, 0, 76, 80, 1, 0, 0, 0, 77, 78, 5, 8, 0,
    0, 78, 80, 5, 16, 0, 0, 79, 73, 1, 0, 0, 0, 79, 77, 1, 0, 0, 0, 80, 13, 1,
    0, 0, 0, 81, 85, 5, 17, 0, 0, 82, 85, 5, 19, 0, 0, 83, 85, 5, 20, 0, 0, 84,
    81, 1, 0, 0, 0, 84, 82, 1, 0, 0, 0, 84, 83, 1, 0, 0, 0, 85, 15, 1, 0, 0, 0,
    86, 87, 5, 20, 0, 0, 87, 88, 5, 5, 0, 0, 88, 89, 3, 18, 9, 0, 89, 90, 5, 6,
    0, 0, 90, 17, 1, 0, 0, 0, 91, 97, 3, 0, 0, 0, 92, 93, 3, 0, 0, 0, 93, 94, 5,
    9, 0, 0, 94, 95, 3, 18, 9, 0, 95, 97, 1, 0, 0, 0, 96, 91, 1, 0, 0, 0, 96,
    92, 1, 0, 0, 0, 97, 19, 1, 0, 0, 0, 98, 99, 5, 10, 0, 0, 99, 100, 3, 22, 11,
    0, 100, 101, 5, 11, 0, 0, 101, 21, 1, 0, 0, 0, 102, 108, 3, 0, 0, 0, 103,
    104, 3, 0, 0, 0, 104, 105, 5, 9, 0, 0, 105, 106, 3, 22, 11, 0, 106, 108, 1,
    0, 0, 0, 107, 102, 1, 0, 0, 0, 107, 103, 1, 0, 0, 0, 108, 23, 1, 0, 0, 0,
    10, 29, 39, 47, 49, 58, 65, 79, 84, 96, 107,
  ];

  private static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!IfcExpressionParser.__ATN) {
      IfcExpressionParser.__ATN = new ATNDeserializer().deserialize(
        IfcExpressionParser._serializedATN
      );
    }

    return IfcExpressionParser.__ATN;
  }

  static DecisionsToDFA = IfcExpressionParser._ATN.decisionToState.map(
    (ds: DecisionState, index: number) => new DFA(ds, index)
  );
}

export class ExprContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public attributeRef(): AttributeRefContext {
    return this.getTypedRuleContext(
      AttributeRefContext,
      0
    ) as AttributeRefContext;
  }
  public functionCall(): FunctionCallContext {
    return this.getTypedRuleContext(
      FunctionCallContext,
      0
    ) as FunctionCallContext;
  }
  public numExpr(): NumExprContext {
    return this.getTypedRuleContext(NumExprContext, 0) as NumExprContext;
  }
  public array(): ArrayContext {
    return this.getTypedRuleContext(ArrayContext, 0) as ArrayContext;
  }
  public stringExpr(): StringExprContext {
    return this.getTypedRuleContext(StringExprContext, 0) as StringExprContext;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_expr;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterExpr) {
      listener.enterExpr(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitExpr) {
      listener.exitExpr(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitExpr) {
      return visitor.visitExpr(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NumExprContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_numExpr;
  }
  public copyFrom(ctx: NumExprContext): void {
    super.copyFrom(ctx);
  }
}
export class NumMulDivContext extends NumExprContext {
  public _op!: Token;
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public numExpr_list(): NumExprContext[] {
    return this.getTypedRuleContexts(NumExprContext) as NumExprContext[];
  }
  public numExpr(i: number): NumExprContext {
    return this.getTypedRuleContext(NumExprContext, i) as NumExprContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumMulDiv) {
      listener.enterNumMulDiv(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumMulDiv) {
      listener.exitNumMulDiv(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumMulDiv) {
      return visitor.visitNumMulDiv(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NumAddSubContext extends NumExprContext {
  public _op!: Token;
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public numExpr_list(): NumExprContext[] {
    return this.getTypedRuleContexts(NumExprContext) as NumExprContext[];
  }
  public numExpr(i: number): NumExprContext {
    return this.getTypedRuleContext(NumExprContext, i) as NumExprContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumAddSub) {
      listener.enterNumAddSub(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumAddSub) {
      listener.exitNumAddSub(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumAddSub) {
      return visitor.visitNumAddSub(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NumParensContext extends NumExprContext {
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public numExpr(): NumExprContext {
    return this.getTypedRuleContext(NumExprContext, 0) as NumExprContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumParens) {
      listener.enterNumParens(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumParens) {
      listener.exitNumParens(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumParens) {
      return visitor.visitNumParens(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NumLitContext extends NumExprContext {
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public numLiteral(): NumLiteralContext {
    return this.getTypedRuleContext(NumLiteralContext, 0) as NumLiteralContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumLit) {
      listener.enterNumLit(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumLit) {
      listener.exitNumLit(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumLit) {
      return visitor.visitNumLit(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NumFunCallContext extends NumExprContext {
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public functionCall(): FunctionCallContext {
    return this.getTypedRuleContext(
      FunctionCallContext,
      0
    ) as FunctionCallContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumFunCall) {
      listener.enterNumFunCall(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumFunCall) {
      listener.exitNumFunCall(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumFunCall) {
      return visitor.visitNumFunCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NumAttributeRefContext extends NumExprContext {
  constructor(parser: IfcExpressionParser, ctx: NumExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public attributeRef(): AttributeRefContext {
    return this.getTypedRuleContext(
      AttributeRefContext,
      0
    ) as AttributeRefContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumAttributeRef) {
      listener.enterNumAttributeRef(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumAttributeRef) {
      listener.exitNumAttributeRef(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumAttributeRef) {
      return visitor.visitNumAttributeRef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NumLiteralContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public INT(): TerminalNode {
    return this.getToken(IfcExpressionParser.INT, 0);
  }
  public FLOAT(): TerminalNode {
    return this.getToken(IfcExpressionParser.FLOAT, 0);
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_numLiteral;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNumLiteral) {
      listener.enterNumLiteral(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNumLiteral) {
      listener.exitNumLiteral(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNumLiteral) {
      return visitor.visitNumLiteral(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class StringExprContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_stringExpr;
  }
  public copyFrom(ctx: StringExprContext): void {
    super.copyFrom(ctx);
  }
}
export class StringAttributeRefContext extends StringExprContext {
  constructor(parser: IfcExpressionParser, ctx: StringExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public attributeRef(): AttributeRefContext {
    return this.getTypedRuleContext(
      AttributeRefContext,
      0
    ) as AttributeRefContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterStringAttributeRef) {
      listener.enterStringAttributeRef(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitStringAttributeRef) {
      listener.exitStringAttributeRef(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitStringAttributeRef) {
      return visitor.visitStringAttributeRef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class StringLiteralContext extends StringExprContext {
  constructor(parser: IfcExpressionParser, ctx: StringExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public QUOTED_STRING(): TerminalNode {
    return this.getToken(IfcExpressionParser.QUOTED_STRING, 0);
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterStringLiteral) {
      listener.enterStringLiteral(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitStringLiteral) {
      listener.exitStringLiteral(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitStringLiteral) {
      return visitor.visitStringLiteral(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class StringFunCallContext extends StringExprContext {
  constructor(parser: IfcExpressionParser, ctx: StringExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public functionCall(): FunctionCallContext {
    return this.getTypedRuleContext(
      FunctionCallContext,
      0
    ) as FunctionCallContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterStringFunCall) {
      listener.enterStringFunCall(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitStringFunCall) {
      listener.exitStringFunCall(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitStringFunCall) {
      return visitor.visitStringFunCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class StringConcatContext extends StringExprContext {
  public _left!: StringExprContext;
  public _right!: StringExprContext;
  constructor(parser: IfcExpressionParser, ctx: StringExprContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public stringExpr_list(): StringExprContext[] {
    return this.getTypedRuleContexts(StringExprContext) as StringExprContext[];
  }
  public stringExpr(i: number): StringExprContext {
    return this.getTypedRuleContext(StringExprContext, i) as StringExprContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterStringConcat) {
      listener.enterStringConcat(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitStringConcat) {
      listener.exitStringConcat(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitStringConcat) {
      return visitor.visitStringConcat(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ObjectRefContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public PROP(): TerminalNode {
    return this.getToken(IfcExpressionParser.PROP, 0);
  }
  public ELEM(): TerminalNode {
    return this.getToken(IfcExpressionParser.ELEM, 0);
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_objectRef;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterObjectRef) {
      listener.enterObjectRef(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitObjectRef) {
      listener.exitObjectRef(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitObjectRef) {
      return visitor.visitObjectRef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class AttributeRefContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public objectRef(): ObjectRefContext {
    return this.getTypedRuleContext(ObjectRefContext, 0) as ObjectRefContext;
  }
  public nestedObjectChain(): NestedObjectChainContext {
    return this.getTypedRuleContext(
      NestedObjectChainContext,
      0
    ) as NestedObjectChainContext;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_attributeRef;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterAttributeRef) {
      listener.enterAttributeRef(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitAttributeRef) {
      listener.exitAttributeRef(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitAttributeRef) {
      return visitor.visitAttributeRef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NestedObjectChainContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_nestedObjectChain;
  }
  public copyFrom(ctx: NestedObjectChainContext): void {
    super.copyFrom(ctx);
  }
}
export class NestedObjectChainEndContext extends NestedObjectChainContext {
  public _name!: Token;
  constructor(parser: IfcExpressionParser, ctx: NestedObjectChainContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public RESERVED_ATTRIBUTE_NAME(): TerminalNode {
    return this.getToken(IfcExpressionParser.RESERVED_ATTRIBUTE_NAME, 0);
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNestedObjectChainEnd) {
      listener.enterNestedObjectChainEnd(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNestedObjectChainEnd) {
      listener.exitNestedObjectChainEnd(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNestedObjectChainEnd) {
      return visitor.visitNestedObjectChainEnd(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
export class NestedObjectChainInnerContext extends NestedObjectChainContext {
  constructor(parser: IfcExpressionParser, ctx: NestedObjectChainContext) {
    super(parser, ctx.parentCtx, ctx.invokingState);
    super.copyFrom(ctx);
  }
  public namedRef(): NamedRefContext {
    return this.getTypedRuleContext(NamedRefContext, 0) as NamedRefContext;
  }
  public nestedObjectChain(): NestedObjectChainContext {
    return this.getTypedRuleContext(
      NestedObjectChainContext,
      0
    ) as NestedObjectChainContext;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNestedObjectChainInner) {
      listener.enterNestedObjectChainInner(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNestedObjectChainInner) {
      listener.exitNestedObjectChainInner(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNestedObjectChainInner) {
      return visitor.visitNestedObjectChainInner(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NamedRefContext extends ParserRuleContext {
  public _name!: Token;
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public RESERVED_RELATION_NAME(): TerminalNode {
    return this.getToken(IfcExpressionParser.RESERVED_RELATION_NAME, 0);
  }
  public BRACKETED_STRING(): TerminalNode {
    return this.getToken(IfcExpressionParser.BRACKETED_STRING, 0);
  }
  public IDENTIFIER(): TerminalNode {
    return this.getToken(IfcExpressionParser.IDENTIFIER, 0);
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_namedRef;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterNamedRef) {
      listener.enterNamedRef(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitNamedRef) {
      listener.exitNamedRef(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitNamedRef) {
      return visitor.visitNamedRef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FunctionCallContext extends ParserRuleContext {
  public _name!: Token;
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public IDENTIFIER(): TerminalNode {
    return this.getToken(IfcExpressionParser.IDENTIFIER, 0);
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_functionCall;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterFunctionCall) {
      listener.enterFunctionCall(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitFunctionCall) {
      listener.exitFunctionCall(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitFunctionCall) {
      return visitor.visitFunctionCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ExprListContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_exprList;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterExprList) {
      listener.enterExprList(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitExprList) {
      listener.exitExprList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitExprList) {
      return visitor.visitExprList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ArrayContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public arrayElementList(): ArrayElementListContext {
    return this.getTypedRuleContext(
      ArrayElementListContext,
      0
    ) as ArrayElementListContext;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_array;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterArray) {
      listener.enterArray(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitArray) {
      listener.exitArray(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitArray) {
      return visitor.visitArray(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ArrayElementListContext extends ParserRuleContext {
  constructor(
    parser?: IfcExpressionParser,
    parent?: ParserRuleContext,
    invokingState?: number
  ) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public arrayElementList(): ArrayElementListContext {
    return this.getTypedRuleContext(
      ArrayElementListContext,
      0
    ) as ArrayElementListContext;
  }
  public get ruleIndex(): number {
    return IfcExpressionParser.RULE_arrayElementList;
  }
  public enterRule(listener: IfcExpressionListener): void {
    if (listener.enterArrayElementList) {
      listener.enterArrayElementList(this);
    }
  }
  public exitRule(listener: IfcExpressionListener): void {
    if (listener.exitArrayElementList) {
      listener.exitArrayElementList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: IfcExpressionVisitor<Result>): Result {
    if (visitor.visitArrayElementList) {
      return visitor.visitArrayElementList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
