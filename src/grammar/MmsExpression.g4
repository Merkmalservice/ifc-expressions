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

objectReference :
    '$' relRef=( PROP | ELEM)           # relativeRef
    | '$' nameOrGuid=BRACKETED_STRING              # nameOrGuidRef

attributeRef :  objectReference '.' attributeChain  ;

attributeChain : name=(IDENTIFIER|BRACKETED_STRING) '.' attributeChain | name=(IDENTIFIER|BRACKETED_STRING);

numValueRef : attributeRef ;

functionCall : name=IDENTIFIER '(' exprList ')' ;

exprList : expr | expr ',' exprList ;

numFunctionCall: functionCall ;

stringFunctionCall: functionCall ;

array : '[' arrayElementList ']' ;

arrayElementList : expr | expr ',' arrayElementList ;


INT     : [0-9]+ ;
FLOAT  : [0-9]+ '.' [0-9]+;
PROP : 'prop' | 'PROP' ;
ELEM : 'elem' | 'ELEM' ;
IDENTIFIER : [a-zA-Z0-9]+ ;
WS : [ \t]+ -> skip ;
NEWLINE : [\r\n]+ -> skip;
STRING : '"' .*? '"' ;
BRACKETED_STRING: '{' .*? '}' ;