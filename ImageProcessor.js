const Jimp = require("jimp").Jimp;
const JimpMime = require("jimp").JimpMime;
const axios = require("axios");
const imageCache = require("./cache");

async function fetchImageBuffer(url) {
  const response = await axios({ url, responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

async function processImage(imageUrl, width, height, res) {
  const cacheKey = `${imageUrl}-${width || "original"}-${height || "original"}`;
  // console.log(filename, { cacheKey });
  const cachedImage = imageCache.get(cacheKey);
  if (cachedImage) {
    console.log("Serving from cache");
    res.set("Content-Type", "image/jpeg");
    return res.send(cachedImage);
  }

  if (width || height) {
    const imageBuffer = await fetchImageBuffer(imageUrl);
    console.log("Serving compressed");
    let responseSent = false; // Flag to track if the response has been sent

    // imageBuffer = await streamToBuffer(readStream);
    try {
      const image = await Jimp.read(imageBuffer);
      if (width) {
        image.resize({ w: width, h: Jimp.AUTO }); // Use object with width
      }
      if (height) {
        image.resize({ w: Jimp.AUTO, h: height }); // Use object with height
      }
      const buf = await image.getBuffer(JimpMime.jpeg);
      imageCache.set(cacheKey, buf);
      res.set("Content-Type", "image/jpeg");
      res.send(buf);
      responseSent = true; // Mark response as sent
    } catch (error) {
      console.error("Error during image processing:", error);
      if (!responseSent) {
        res.status(500).json({ err: "Error processing image" });
        responseSent = true; // Mark response as sent
      }
    }
  } else {
    // Serve the original file
    res.set("Content-Type", "image/jpeg");
    readStream.pipe(res);
  }
}

module.exports = processImage;
