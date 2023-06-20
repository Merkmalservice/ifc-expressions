// Generated from IfcExpression.g4 by ANTLR 4.13.0
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class IfcExpressionLexer extends Lexer {
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

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	public static readonly literalNames: (string | null)[] = [ null, "'*'", 
                                                            "'/'", "'+'", 
                                                            "'-'", "'('", 
                                                            "')'", "'.'", 
                                                            "'@'", "','", 
                                                            "'['", "']'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             "INT", "FLOAT", 
                                                             "PROP", "ELEM", 
                                                             "RESERVED_ATTRIBUTE_NAME", 
                                                             "RESERVED_RELATION_NAME", 
                                                             "QUOTED_STRING", 
                                                             "BRACKETED_STRING", 
                                                             "IDENTIFIER", 
                                                             "WS", "NEWLINE" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", 
		"T__9", "T__10", "INT", "FLOAT", "PROP", "ELEM", "RESERVED_ATTRIBUTE_NAME", 
		"RESERVED_RELATION_NAME", "QUOTED_STRING", "BRACKETED_STRING", "IDENTIFIER", 
		"WS", "NEWLINE",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, IfcExpressionLexer._ATN, IfcExpressionLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "IfcExpression.g4"; }

	public get literalNames(): (string | null)[] { return IfcExpressionLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return IfcExpressionLexer.symbolicNames; }
	public get ruleNames(): string[] { return IfcExpressionLexer.ruleNames; }

	public get serializedATN(): number[] { return IfcExpressionLexer._serializedATN; }

	public get channelNames(): string[] { return IfcExpressionLexer.channelNames; }

	public get modeNames(): string[] { return IfcExpressionLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,22,185,6,-1,2,0,
	7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,
	7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,
	16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,1,0,1,0,1,1,1,1,1,
	2,1,2,1,3,1,3,1,4,1,4,1,5,1,5,1,6,1,6,1,7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,
	1,11,4,11,69,8,11,11,11,12,11,70,1,12,4,12,74,8,12,11,12,12,12,75,1,12,
	1,12,4,12,80,8,12,11,12,12,12,81,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,
	3,13,92,8,13,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,3,14,102,8,14,1,15,
	1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,
	15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,
	1,15,1,15,3,15,136,8,15,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,3,16,146,
	8,16,1,17,1,17,5,17,150,8,17,10,17,12,17,153,9,17,1,17,1,17,1,18,1,18,4,
	18,159,8,18,11,18,12,18,160,1,18,1,18,1,19,1,19,5,19,167,8,19,10,19,12,
	19,170,9,19,1,20,4,20,173,8,20,11,20,12,20,174,1,20,1,20,1,21,4,21,180,
	8,21,11,21,12,21,181,1,21,1,21,2,151,160,0,22,1,1,3,2,5,3,7,4,9,5,11,6,
	13,7,15,8,17,9,19,10,21,11,23,12,25,13,27,14,29,15,31,16,33,17,35,18,37,
	19,39,20,41,21,43,22,1,0,5,1,0,48,57,3,0,65,90,95,95,97,122,7,0,36,36,38,
	38,45,45,48,57,65,90,95,95,97,122,2,0,9,9,32,32,2,0,10,10,13,13,199,0,1,
	1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,
	13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,
	0,0,0,25,1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,
	35,1,0,0,0,0,37,1,0,0,0,0,39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,1,45,1,0,
	0,0,3,47,1,0,0,0,5,49,1,0,0,0,7,51,1,0,0,0,9,53,1,0,0,0,11,55,1,0,0,0,13,
	57,1,0,0,0,15,59,1,0,0,0,17,61,1,0,0,0,19,63,1,0,0,0,21,65,1,0,0,0,23,68,
	1,0,0,0,25,73,1,0,0,0,27,91,1,0,0,0,29,101,1,0,0,0,31,135,1,0,0,0,33,145,
	1,0,0,0,35,147,1,0,0,0,37,156,1,0,0,0,39,164,1,0,0,0,41,172,1,0,0,0,43,
	179,1,0,0,0,45,46,5,42,0,0,46,2,1,0,0,0,47,48,5,47,0,0,48,4,1,0,0,0,49,
	50,5,43,0,0,50,6,1,0,0,0,51,52,5,45,0,0,52,8,1,0,0,0,53,54,5,40,0,0,54,
	10,1,0,0,0,55,56,5,41,0,0,56,12,1,0,0,0,57,58,5,46,0,0,58,14,1,0,0,0,59,
	60,5,64,0,0,60,16,1,0,0,0,61,62,5,44,0,0,62,18,1,0,0,0,63,64,5,91,0,0,64,
	20,1,0,0,0,65,66,5,93,0,0,66,22,1,0,0,0,67,69,7,0,0,0,68,67,1,0,0,0,69,
	70,1,0,0,0,70,68,1,0,0,0,70,71,1,0,0,0,71,24,1,0,0,0,72,74,7,0,0,0,73,72,
	1,0,0,0,74,75,1,0,0,0,75,73,1,0,0,0,75,76,1,0,0,0,76,77,1,0,0,0,77,79,5,
	46,0,0,78,80,7,0,0,0,79,78,1,0,0,0,80,81,1,0,0,0,81,79,1,0,0,0,81,82,1,
	0,0,0,82,26,1,0,0,0,83,84,5,112,0,0,84,85,5,114,0,0,85,86,5,111,0,0,86,
	92,5,112,0,0,87,88,5,80,0,0,88,89,5,82,0,0,89,90,5,79,0,0,90,92,5,80,0,
	0,91,83,1,0,0,0,91,87,1,0,0,0,92,28,1,0,0,0,93,94,5,101,0,0,94,95,5,108,
	0,0,95,96,5,101,0,0,96,102,5,109,0,0,97,98,5,69,0,0,98,99,5,76,0,0,99,100,
	5,69,0,0,100,102,5,77,0,0,101,93,1,0,0,0,101,97,1,0,0,0,102,30,1,0,0,0,
	103,104,5,118,0,0,104,105,5,97,0,0,105,106,5,108,0,0,106,107,5,117,0,0,
	107,136,5,101,0,0,108,109,5,103,0,0,109,110,5,117,0,0,110,111,5,105,0,0,
	111,136,5,100,0,0,112,113,5,110,0,0,113,114,5,97,0,0,114,115,5,109,0,0,
	115,136,5,101,0,0,116,117,5,100,0,0,117,118,5,101,0,0,118,119,5,115,0,0,
	119,120,5,99,0,0,120,121,5,114,0,0,121,122,5,105,0,0,122,123,5,112,0,0,
	123,124,5,116,0,0,124,125,5,105,0,0,125,126,5,111,0,0,126,136,5,110,0,0,
	127,128,5,105,0,0,128,129,5,102,0,0,129,130,5,99,0,0,130,131,5,67,0,0,131,
	132,5,108,0,0,132,133,5,97,0,0,133,134,5,115,0,0,134,136,5,115,0,0,135,
	103,1,0,0,0,135,108,1,0,0,0,135,112,1,0,0,0,135,116,1,0,0,0,135,127,1,0,
	0,0,136,32,1,0,0,0,137,138,5,116,0,0,138,139,5,121,0,0,139,140,5,112,0,
	0,140,146,5,101,0,0,141,142,5,112,0,0,142,143,5,115,0,0,143,144,5,101,0,
	0,144,146,5,116,0,0,145,137,1,0,0,0,145,141,1,0,0,0,146,34,1,0,0,0,147,
	151,5,34,0,0,148,150,9,0,0,0,149,148,1,0,0,0,150,153,1,0,0,0,151,152,1,
	0,0,0,151,149,1,0,0,0,152,154,1,0,0,0,153,151,1,0,0,0,154,155,5,34,0,0,
	155,36,1,0,0,0,156,158,5,123,0,0,157,159,9,0,0,0,158,157,1,0,0,0,159,160,
	1,0,0,0,160,161,1,0,0,0,160,158,1,0,0,0,161,162,1,0,0,0,162,163,5,125,0,
	0,163,38,1,0,0,0,164,168,7,1,0,0,165,167,7,2,0,0,166,165,1,0,0,0,167,170,
	1,0,0,0,168,166,1,0,0,0,168,169,1,0,0,0,169,40,1,0,0,0,170,168,1,0,0,0,
	171,173,7,3,0,0,172,171,1,0,0,0,173,174,1,0,0,0,174,172,1,0,0,0,174,175,
	1,0,0,0,175,176,1,0,0,0,176,177,6,20,0,0,177,42,1,0,0,0,178,180,7,4,0,0,
	179,178,1,0,0,0,180,181,1,0,0,0,181,179,1,0,0,0,181,182,1,0,0,0,182,183,
	1,0,0,0,183,184,6,21,0,0,184,44,1,0,0,0,13,0,70,75,81,91,101,135,145,151,
	160,168,174,181,1,6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!IfcExpressionLexer.__ATN) {
			IfcExpressionLexer.__ATN = new ATNDeserializer().deserialize(IfcExpressionLexer._serializedATN);
		}

		return IfcExpressionLexer.__ATN;
	}


	static DecisionsToDFA = IfcExpressionLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}