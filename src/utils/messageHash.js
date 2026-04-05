/**
 * SHA-256 (hex) of a string — matches server `hash('sha256', $text)` for UTF-8 bodies.
 */
export async function sha256Hex(text) {
  if (typeof text !== 'string') {
    return ''
  }
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
