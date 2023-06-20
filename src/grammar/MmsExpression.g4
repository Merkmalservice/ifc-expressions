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
    | functionCall                 # numFunCall
    | attributeRef                    # numAttributeRef
    ;

numLiteral:
    INT
    |   FLOAT
    ;

stringExpr :
    QUOTED_STRING                      # stringLiteral
    | left=stringExpr '+' right=stringExpr        # stringConcat
    | functionCall                     # stringFunCall
    | attributeRef                     # stringAttributeRef
    ;

objectRef : PROP | ELEM ;

attributeRef :  objectRef nestedObjectChain ;

nestedObjectChain :
    '.' namedRef nestedObjectChain              #nestedObjectChainInner
    | '@' name=RESERVED_ATTRIBUTE_NAME          #nestedObjectChainEnd
    ;

namedRef:
    name=RESERVED_RELATION_NAME
    | name=BRACKETED_STRING
    | name=IDENTIFIER
    ;

functionCall : name=IDENTIFIER '(' exprList ')' ;

exprList : expr | expr ',' exprList ;

array : '[' arrayElementList ']' ;

arrayElementList : expr | expr ',' arrayElementList ;


INT     : [0-9]+ ;
FLOAT  : [0-9]+ '.' [0-9]+;
PROP : 'prop' | 'PROP' ;
ELEM : 'elem' | 'ELEM' ;
RESERVED_ATTRIBUTE_NAME : 'value'|'guid'|'name'|'description'|'ifcClass' ;
RESERVED_RELATION_NAME: 'type' | 'pset' ;
QUOTED_STRING : '"' .*? '"' ;
BRACKETED_STRING: '{' .+? '}' ;
IDENTIFIER : [a-zA-Z0-9_\-$&]+ ;
WS : [ \t]+ -> skip ;
NEWLINE : [\r\n]+ -> skip;
