export type CompletionItemKind =
  | "builtinRoot"
  | "builtinFunction"
  | "builtinMemberProperty"
  | "builtinMemberFunction";

export type CompletionItem = {
  kind: CompletionItemKind;
  label: string;
  insertText?: string;
  cursorOffset?: number;
  argumentTypeNames?: Array<string>;
  returnTypeName?: string;
  chainable?: boolean;
};

export type CompletionResult = {
  items: Array<CompletionItem>;
  replaceFrom: number;
  replaceTo: number;
};
