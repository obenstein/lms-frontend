/** Plain text from rich-text HTML, for short previews. */
export const toPlainText = (html?: string | null): string =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

// Uploads are stored under generated names (see lib/r2.ts), e.g.
// "1763912345678-ab12cd34ef56.pdf", which mean nothing to a student.
const GENERATED_NAME = /^\d{10,}-[0-9a-f]{12}(\.|$)/i;

/** A readable name for a file URL: its file name, or "Resource 2" if generated. */
export const describeFile = (url: string, index: number) => {
  let fileName = url.split(/[?#]/)[0].split("/").pop() ?? "";
  try {
    fileName = decodeURIComponent(fileName);
  } catch {
    // Not valid percent-encoding: show it as it is.
  }
  const extension = /\.([a-z0-9]{1,5})$/i.exec(fileName)?.[1].toUpperCase() ?? "FILE";
  const name = !fileName || GENERATED_NAME.test(fileName) ? `Resource ${index + 1}` : fileName;
  return { name, extension };
};
