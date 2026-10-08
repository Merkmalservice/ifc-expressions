grammar IfcExpression;

expr : singleExpr EOF ;

singleExpr:
    <assoc=right> '--' sub=singleExpr                       # SEUnaryMultipleMinus //not allowed, will cause validation listener to complain
    | '(' sub=singleExpr ')'                                # SEParenthesis
    | <assoc=right> '-' sub=singleExpr                      # SEUnaryMinus
    | <assoc=right> left=singleExpr op='^' right=singleExpr # SEPower
    | target=singleExpr call=methodCallChain                # SEMethodCall
    | left=singleExpr op=('*'|'/') right=singleExpr         # SEMulDiv
    | left=singleExpr op=('+'|'-') right=singleExpr         # SEAddSub
    | left=singleExpr CMP_OP right=singleExpr               # SEComparison
    | <assoc=right> '!'  sub=singleExpr                     # SENot
    | left=singleExpr op=BOOLEAN_BINARY_OP right=singleExpr # SEBooleanBinaryOp
    | EXISTS '(' sub=singleExpr ')'                         # SEExists
    | sub=variableRef                                       # SEVariableRef
    | sub=functionCall                                      # SEFunctionCall
    | sub=literal                                           # SELiteral
    | sub=arrayExpr                                         # SEArrayExpr
    ;

methodCallChain:
DOT target=methodAccessor call=methodCallChain             # methodCallChainInner
    | DOT call=methodAccessor                              # methodCallChainEnd
    ;

methodAccessor:
    functionCall                                           # MethodFunctionCall
    | memberName                                           # MethodPropertyAccess
    ;

// Keywords remain literals in ordinary expression positions but may be
// provider-defined names after a member-access dot.
memberName: IDENTIFIER | LOGICAL_UNKNOWN | BOOLEAN ;

functionCall :
    IDENTIFIER '('sub=exprList ? ')'
;

exprList : singleExpr | singleExpr ',' exprList ;

arrayExpr : '[' sub=arrayElementList? ']' ;

arrayElementList : singleExpr | singleExpr ',' arrayElementList ;

literal:
    numLiteral
    | stringLiteral
    | booleanLiteral
    | logicalLiteral
;

numLiteral:
    ( INT | FLOAT )
    ;

stringLiteral: QUOTED_STRING ;

booleanLiteral:  BOOLEAN ;

logicalLiteral: LOGICAL_UNKNOWN ;

variableRef:
    '$' IDENTIFIER
;

INT     : [0-9]+ ;
FLOAT  : [0-9]+ '.' [0-9]+;
BOOLEAN : ('TRUE'|'true'|'FALSE'|'false');
LOGICAL_UNKNOWN: ('UNKNOWN'|'unknown');
EXISTS: ('EXISTS'|'exists');
DOT : '.';
QUOTED_STRING : ('"' .*? '"') | ('\'' .*? '\'' );
IDENTIFIER : [a-zA-Z_][a-zA-Z0-9_\-$&]* ;
WS : [ \t]+ -> skip ;
NEWLINE : [\r\n]+ -> skip;
BOOLEAN_BINARY_OP: ('||'|'&&'|'><');
CMP_OP: ('=='|'<'|'>'|'>='|'<='|'!=');
