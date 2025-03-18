require("dotenv").config();
const express = require("express");
const processImage = require("./ImageProcessor.js");

const app = express();
const port = process.env.PORT || 4000;

app.get("/resize", async (req, res) => {
  try {
    const { url, width, height } = req.query;
    if (!url) return res.status(400).json({ error: "Image URL is required" });

    const parsedWidth = width ? parseInt(width, 10) : undefined;
    const parsedHeight = height ? parseInt(height, 10) : undefined;

    await processImage(url, parsedWidth, parsedHeight, res);

    // res.set("Content-Type", contentType);
    // res.send(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

app.listen(port, () => {
  console.log(`Image service running on http://localhost:${port}`);
});
