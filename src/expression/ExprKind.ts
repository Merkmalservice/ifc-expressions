export enum ExprKind {
  NUM_DIVIDE = "NUM_DIVIDE",
  NUM_MULTIPLY = "NUM_MULTIPLY",
  NUM_PLUS = "NUM_PLUS",
  NUM_MINUS = "NUM_MINUS",
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
  FUNCTION_ARGUMENTS = "FUNCTION_ARGUMENTS",
  FUNCTION = "FUNCTION",
  ARRAY = "ARRAY",
}