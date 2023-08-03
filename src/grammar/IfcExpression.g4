grammar IfcExpression;

expr : singleExpr EOF ;

singleExpr:
    variableRef                                         # singleExprVariableRef
    | singleExpr CMP_OP singleExpr                      # singleExprComparison
    | functionCall                                      # singleExprFunctionCall
    | numExpr                                           # singleExprNumExpr
    | booleanExpr                                       # singleExprBooleanExpr
    | arrayExpr                                         # singleExprArrayExpr
    | stringExpr                                        # singleExprStringExpr
    | singleExpr methodCallChain                        # singleExprMethodCall
    ;


numExpr:
    numericMethodCall                                   # numMethodCall
    | <assoc=right> '--' numExpr                        # numUnaryMultipleMinus
    | <assoc=right> '-' numExpr                         # numUnaryMinus
    | <assoc=right> numExpr op='^' numExpr              # numPow
    | numExpr op=('*'|'/') numExpr                      # numMulDiv
    | numExpr op=('+'|'-') numExpr                      # numAddSub
    | '(' numExpr ')'                                   # numParens
    | numLiteral                                        # numLit
    | functionCall                                      # numFunCall
    | variableRef                                       # numVariableRef
    ;

numericMethodCall:
     numLiteral methodCallChain
     | functionCall methodCallChain
     | '(' numExpr ')' methodCallChain
     | variableRef methodCallChain
;

numLiteral:
    INT
    | FLOAT
    ;

stringExpr :
    stringMethodCall                            # SEStringMethodCall
    | left=stringExpr '+' right=stringExpr      # SEConcat
    | QUOTED_STRING                             # SELiteral
    | '(' stringExpr ')'                        # SEParens
    | functionCall                              # SEFunCall
    | variableRef                               # SEVariableRef
    ;

stringMethodCall:
    QUOTED_STRING methodCallChain
    | '(' stringExpr ')' methodCallChain
    | functionCall methodCallChain
    | variableRef methodCallChain
    ;

booleanExpr :
    BOOLEAN                                             #BooleanExprLiteral
    | booleanMethodCall                                 #BooleanExprMethodCall
    | <assoc=right> '!'  booleanExpr                    #BooleanExprNot
    | booleanExpr op=('&&'|'||'|'^') booleanExpr        #BooleanExprBinaryOp
    | '(' booleanExpr ')'                               #BooleanExprParens
    | functionCall                                      #BooleanExprFunctionCall
    | variableRef                                       #BooleanExprVariableRef
;

booleanMethodCall:
    BOOLEAN methodCallChain
    | '(' booleanExpr ')' methodCallChain
    | functionCall methodCallChain
    | variableRef methodCallChain
    ;


variableRef:
    '$' IDENTIFIER
;
methodCallChain:
    DOT functionCall methodCallChain    # methodCallChainInner
    | DOT functionCall                  # methodCallChainEnd
    ;

functionCall :
    IDENTIFIER '(' exprList ? ')'
;

exprList : singleExpr | singleExpr ',' exprList ;

arrayExpr : '[' arrayElementList? ']' ;

arrayElementList : singleExpr | singleExpr ',' arrayElementList ;


INT     : [0-9]+ ;
FLOAT  : [0-9]+ '.' [0-9]+;
BOOLEAN : [Tt][Rr][Uu][Ee] | [Ff][Aa][Ll][Ss][Ee] ;
DOT : '.';
QUOTED_STRING : ('"' .*? '"') | ('\'' .*? '\'' );
IDENTIFIER : [a-zA-Z_][a-zA-Z0-9_\-$&]* ;
WS : [ \t]+ -> skip ;
NEWLINE : [\r\n]+ -> skip;
CMP_OP: ('=='|'<'|'>'|'>='|'<='|'!=');