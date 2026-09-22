/**
 * Converts a Mongoose Document (or array of them) into a plain,
 * JSON-serializable object. Needed because Next.js Server Components can't
 * pass Mongoose docs (or their Map-typed fields / ObjectIds) as props to
 * Client Components — only plain objects are allowed.
 *
 * This relies on Mongoose's built-in toJSON on documents/Maps, so nested
 * Map fields (purchased, isCompleted, userProgress, etc.) come out as plain
 * objects automatically — just use bracket/dot access on them afterward
 * instead of `.get()`/`.set()`.
 */
export function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
