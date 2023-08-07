export enum ExprKind {
  NUM_DIVIDE = "NUM_DIVIDE",
  NUM_MULTIPLY = "NUM_MULTIPLY",
  NUM_PLUS = "NUM_PLUS",
  NUM_MINUS = "NUM_MINUS",
  NUM_POWER = "POWER",
  NUM_UNARY_MINUS = "UNARY_MINUS",
  NUM_LITERAL = "NUM_LiTERAL",
  NUM_PARENTHESIS = "NUM_PARENTHESIS",
  REF_ATTRIBUTE = "REF_ATTRIBUTE",
  REF_ELEMENT = "REF_ELEMENT",
  REF_NESTED_OBJECT_CHAIN_END = "REF_NESTED_OBJECT_CHAIN_END",
  REF_NESTED_OBJECT_CHAIN = "REF_NESTED_OBJECT_CHAIN ",
  REF_OBJECT = "REF_OBJECT",
  REF_PROPERTY = "REF_PROPERTY",
  STR_CONCAT = "STR_CONCAT",
  STR_LITERAL = "STR_LITERAL",
  STR_PARENTHESIS = "STR_PARENTHESIS",
  FUNCTION_ARGUMENTS = "FUNCTION_ARGUMENTS",
  FUNCTION = "FUNCTION",
  ARRAY = "ARRAY",
  METHOD_CALL = "METHOD_CALL",
  BOOLEAN_AND = "BOOLEAN_AND",
  BOOLEAN_OR = "BOOLEAN_OR",
  BOOLEAN_XOR = "BOOLEAN_XOR",
  BOOLEAN_NOT = "BOOLEAN_NOT",
  BOOLEAN_LITERAL = "BOOLEAN_LITERAL",
  BOOLEAN_PARENTHESIS = "BOOLEAN_PARENTHESIS",
  CMP_EQUALS = "CMP_EQUALS",
  CMP_NOT_EQUALS = "CMP_NOT_EQUALS",
  CMP_LESS_THAN = "CMP_LESS_THAN",
  CMP_LESS_THAN_OR_EQUAL = "CMP_LESS_THAN_OR_EQUAL",
  CMP_GREATER_THAN = "CMP_GREATER_THAN",
  CMP_GREATER_THAN_OR_EQUAL = "CMP_GREATER_THAN_OR_EQUAL",
}
