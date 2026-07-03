export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w؀-ۿ-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
