grammar MmsExpression;

expr :
    attributeRef
    | functionCall
    | numExpr
    | array
    | stringExpr
    ;

numExpr:
    numExpr op=('*'|'/') numExpr      # numMulDiv
    | numExpr op=('+'|'-') numExpr    # numAddSub
    | numLiteral                      # numLit
    | '(' numExpr ')'                 # numParens
    | numFunctionCall                 # numFunCall
    | numValueRef                     # numValRef
    ;

numLiteral:
    INT
    |   FLOAT
    ;

stringExpr :
    | stringLiteral
    | stringExpr '+' stringExpr
    | stringFunctionCall
    ;

stringLiteral : STRING ;

objectReference : THIS | '${' IDENTIFIER '}' ;

attributeRef :  objectReference '.' attributeChain  ;

attributeChain : IDENTIFIER '.' attributeChain | IDENTIFIER;

numValueRef : attributeRef ;

functionCall : IDENTIFIER '(' exprList ')' ;

exprList : expr | expr ',' exprList ;

numFunctionCall: functionCall ;

stringFunctionCall: functionCall ;

array : '[' arrayElementList ']' ;

arrayElementList : expr | expr ',' arrayElementList ;


INT     : [0-9]+ ;
FLOAT  : [0-9]+ '.' [0-9]+;
IDENTIFIER : [a-zA-Z0-9]+ ;
THIS : '$this' | '$THIS' ;
WS : [ \t]+ -> skip ;
NEWLINE : [\r\n]+ -> skip;
STRING : '"' .*? '"' ;