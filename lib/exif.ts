/**
 * Reads the EXIF orientation (1-8) from JPEG bytes. Returns 1 when absent or unreadable.
 * pdf-lib embeds JPEG data as-is and ignores this tag, so photos with orientation != 1 must be redrawn.
 */
export function readJpegOrientation(bytes: Uint8Array): number {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return 1;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 < bytes.length) {
    if (bytes[offset] !== 0xff) return 1;
    const marker = bytes[offset + 1] as number;
    if (marker === 0xda || marker === 0xd9) return 1;
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1 && offset + 10 < bytes.length) {
      const isExif =
        bytes[offset + 4] === 0x45 && bytes[offset + 5] === 0x78 && bytes[offset + 6] === 0x69 && bytes[offset + 7] === 0x66;
      if (isExif) {
        const tiff = offset + 10;
        const little = bytes[tiff] === 0x49;
        if (!little && bytes[tiff] !== 0x4d) return 1;
        const ifd = tiff + view.getUint32(tiff + 4, little);
        if (ifd + 2 > bytes.length) return 1;
        const entries = view.getUint16(ifd, little);
        for (let i = 0; i < entries; i++) {
          const e = ifd + 2 + i * 12;
          if (e + 12 > bytes.length) return 1;
          if (view.getUint16(e, little) === 0x0112) {
            const value = view.getUint16(e + 8, little);
            return value >= 1 && value <= 8 ? value : 1;
          }
        }
        return 1;
      }
    }
    offset += 2 + size;
  }
  return 1;
}
