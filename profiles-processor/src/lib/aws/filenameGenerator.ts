/**
 * Generates random data filename.
 */
export default function generate(ext = 'data'): string {
  const key = Math.random().toString(36).substring(2);

  return `${key}.${ext}`;
}
