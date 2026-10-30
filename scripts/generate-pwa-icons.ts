import sharp from "sharp";
import path from "path";

const input = path.join(process.cwd(), "public/logo.png");
const outputDir = path.join(process.cwd(), "public/icons");

async function generateIcons() {
  await sharp(input)
    .resize(192, 192, {
      fit: "contain",
      background: "#ffffff",
    })
    .png()
    .toFile(path.join(outputDir, "icon-192x192.png"));

  await sharp(input)
    .resize(512, 512, {
      fit: "contain",
      background: "#ffffff",
    })
    .png()
    .toFile(path.join(outputDir, "icon-512x512.png"));

  console.log("PWA icons generated successfully!");
}

generateIcons().catch(console.error);