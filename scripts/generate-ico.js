const fs = require('fs');
const path = require('path');

// Create a minimal ICO file that embeds a single PNG image. Many modern
// Windows versions accept PNG-encoded images inside ICO containers.
// This avoids external dependencies.

function createIcoFromPngBuffer(pngBuffer) {
  // ICONDIR header: reserved (2 bytes), type (2 bytes), count (2 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = 1 (icon)
  header.writeUInt16LE(1, 4); // count = 1

  // ICONDIRENTRY (16 bytes)
  const entry = Buffer.alloc(16);
  // width & height: 0 means 256
  entry.writeUInt8(0, 0); // width
  entry.writeUInt8(0, 1); // height
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitcount (32 bits)
  entry.writeUInt32LE(pngBuffer.length, 8); // bytes in resource
  const imageOffset = header.length + entry.length;
  entry.writeUInt32LE(imageOffset, 12); // image offset

  return Buffer.concat([header, entry, pngBuffer]);
}

(async () => {
  try {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const src = path.join(assetsDir, 'NTA logo.png');
    const out = path.join(assetsDir, 'NTA-logo.ico');

    if (!fs.existsSync(src)) {
      console.log('Source icon not found:', src);
      process.exit(0);
    }

    const pngBuf = await fs.promises.readFile(src);
    const icoBuf = createIcoFromPngBuffer(pngBuf);
    await fs.promises.writeFile(out, icoBuf);
    console.log('Generated ICO at', out);
  } catch (err) {
    console.error('Failed to generate ICO:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
