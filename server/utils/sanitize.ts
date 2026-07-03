import xss from "xss";

const richTextOptions = {
  whiteList: {
    p: [], br: [], strong: [], em: [], u: [], s: [], ul: [], ol: [], li: [],
    h1: [], h2: [], h3: [], h4: [], a: ["href", "target", "rel"], img: ["src", "alt"],
    blockquote: [], code: [], pre: [], span: ["style"],
  },
};

export function sanitizePlainText(value: string): string {
  return xss(value, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ["script", "style"] });
}

export function sanitizeRichText(value: string): string {
  return xss(value, richTextOptions);
}

export function sanitizeObjectStrings<T extends Record<string, unknown>>(obj: T, richTextKeys: (keyof T)[] = []): T {
  const result: Record<string, unknown> = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      result[key] = richTextKeys.includes(key as keyof T) ? sanitizeRichText(value) : sanitizePlainText(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (typeof item === "string" ? sanitizePlainText(item) : item));
    }
  }
  return result as T;
}
