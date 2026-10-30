
import sharp from "sharp";
import path from "path";

const input = path.join(process.cwd(), "public/logo.png");
const outputDir = path.join(process.cwd(), "public/icons");

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: "#1e293b",
      },
    })
      .composite([
        {
          input: await sharp(input)
            .resize({
              width: Math.round(size * 0.75),
              height: Math.round(size * 0.75),
              fit: "contain",
            })
            .png()
            .toBuffer(),
          gravity: "centre",
        },
      ])
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
  }

  console.log("PWA icons generated successfully!");
}

generateIcons().catch(console.error);
