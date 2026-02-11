import fs from "fs";
import path from "path";
import sharp from "sharp";

const DATA_PATH = path.resolve("data/products.json");
const SOURCE_DIR = path.resolve("public/raw-images");
const OUTPUT_DIR = path.resolve("public/catalog");
const FAILED_PATH = path.resolve("data/failed-images.json");

const IMAGE_WIDTH = 800;
const AVIF_QUALITY = 50;

const SUPPORTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

// ensure output dir
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// load products
const products = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

const failedImages = [];

function findMatchingImage(itemCode) {
  for (const ext of SUPPORTED_EXT) {
    const filePath = path.join(SOURCE_DIR, `${itemCode}${ext}`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize({ width: IMAGE_WIDTH, withoutEnlargement: true })
    .toFormat("avif", { quality: AVIF_QUALITY })
    .toFile(outputPath);
}

async function buildImage(product) {
  if (!product.item) return;

  const sourceImage = findMatchingImage(product.item);

  if (!sourceImage) {
    console.warn(`No image found for ${product.item}`);

    failedImages.push({
      item: product.item,
      reason: "Image not found in source directory",
    });
    return;
  }

  const outputFile = `${product.item}.avif`;
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  if (!fs.existsSync(outputPath)) {
    console.log(`🖼️  Optimizing ${product.item}`);
    await optimizeImage(sourceImage, outputPath);
  }

  // update json with public path
  product.image = `/catalog/${outputFile}`;
}

(async () => {
  for (const product of products) {
    await buildImage(product);
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));

  if (failedImages.length > 0) {
    fs.writeFileSync(FAILED_PATH, JSON.stringify(failedImages, null, 2));
    console.warn(`⚠️ ${failedImages.length} images failed`);
  }

  console.log("Image optimization complete");
})();
