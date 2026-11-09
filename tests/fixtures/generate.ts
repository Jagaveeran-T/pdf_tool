/**
 * Generates the binary test fixtures (images and PDFs) into tests/fixtures.
 * Used as a Vitest and Playwright globalSetup, so nothing binary needs to be committed.
 * It runs automatically with `npm test` and `npm run test:e2e`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, PDFHexString, PDFName, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";

// __dirname works in both Vitest and Playwright (which loads TypeScript as CommonJS).
const dir = __dirname;
const out = (name: string) => join(dir, name);

async function makeImage(width: number, height: number, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#dbeafe"/><rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#2563eb" stroke-width="6"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${Math.round(height / 6)}" text-anchor="middle" fill="#1e3a8a">${label}</text></svg>`;
  return sharp(Buffer.from(svg));
}

async function makePdf(pages: number, title: string): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const colours = [rgb(0.15, 0.39, 0.92), rgb(0.02, 0.59, 0.41), rgb(0.85, 0.47, 0.02)];
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawRectangle({ x: 0, y: 700, width: 595.28, height: 141.89, color: colours[(i - 1) % colours.length] });
    page.drawText(title, { x: 48, y: 760, size: 34, font, color: rgb(1, 1, 1) });
    page.drawText(`Page ${i} of ${pages}`, { x: 48, y: 725, size: 16, font: body, color: rgb(1, 1, 1) });
    for (let l = 0; l < 14; l++) {
      page.drawRectangle({ x: 48, y: 640 - l * 34, width: l % 4 === 3 ? 300 : 499, height: 10, color: rgb(0.85, 0.88, 0.93) });
    }
  }
  return doc;
}

export default async function generate(): Promise<void> {
  mkdirSync(dir, { recursive: true });

  writeFileSync(out("sample.jpg"), await (await makeImage(1200, 800, "JPG sample")).jpeg({ quality: 85 }).toBuffer());
  writeFileSync(out("sample.png"), await (await makeImage(800, 1000, "PNG sample")).png().toBuffer());
  writeFileSync(out("sample.webp"), await (await makeImage(900, 600, "WebP sample")).webp().toBuffer());
  // JPEG that carries an EXIF orientation flag (6 = rotate 90 degrees clockwise when displayed)
  writeFileSync(out("sample-exif-rotated.jpg"), await (await makeImage(1000, 600, "EXIF 6")).jpeg().withMetadata({ orientation: 6 }).toBuffer());

  writeFileSync(out("sample-3pages.pdf"), await (await makePdf(3, "Sample")).save());
  writeFileSync(out("sample-2pages.pdf"), await (await makePdf(2, "Second")).save());

  // A PDF whose trailer points at an /Encrypt dictionary: pdf-lib refuses to load it, like a real protected file.
  const enc = await makePdf(1, "Encrypted");
  const encDict = enc.context.obj({
    Filter: PDFName.of("Standard"),
    V: 1,
    R: 2,
    O: PDFHexString.of("00".repeat(32)),
    U: PDFHexString.of("00".repeat(32)),
    P: -4,
  });
  enc.context.trailerInfo.Encrypt = enc.context.register(encDict);
  writeFileSync(out("encrypted.pdf"), await enc.save({ useObjectStreams: false }));

  // A PDF that starts correctly but is cut off halfway.
  const whole = await (await makePdf(3, "Corrupt")).save({ useObjectStreams: false });
  writeFileSync(out("corrupt.pdf"), whole.subarray(0, Math.floor(whole.length / 2)));

  writeFileSync(out("not-a-pdf.pdf"), "This is plain text with a .pdf extension.");
}
