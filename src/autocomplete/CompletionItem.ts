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
  documentation?: string;
};

export type ActiveHelp = {
  label: string;
  documentation: string;
  activeParameterIndex?: number;
  activeParameterLabel?: string;
  activeParameterDocumentation?: string;
};

export type CompletionResult = {
  items: Array<CompletionItem>;
  replaceFrom: number;
  replaceTo: number;
  activeHelp?: ActiveHelp;
};
