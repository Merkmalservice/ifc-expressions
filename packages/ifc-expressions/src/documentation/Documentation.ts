export type LocalizedText = {
  key: string;
  fallback: string;
};

export type DocumentationLocalizer = {
  t(key: string, fallback: string): string;
};

export type ArgumentDocumentation = {
  label: LocalizedText;
  documentation: LocalizedText;
};

export function resolveLocalizedText(
  text: LocalizedText | undefined,
  localizer?: DocumentationLocalizer
): string | undefined {
  if (!text) {
    return undefined;
  }

  return localizer ? localizer.t(text.key, text.fallback) : text.fallback;
}
