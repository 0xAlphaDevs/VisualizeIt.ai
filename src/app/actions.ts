"use server";

import path from "node:path";
import { openAsBlob } from "node:fs";
// import { writeFileSync } from "node:fs";
import { Livepeer } from "@livepeer/ai";
import { revalidatePath } from "next/cache";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { get } from "https";
import { Image } from "@livepeer/ai/models/components";

const livepeerAI = new Livepeer({
  httpBearer: process.env.LIVEPEER_API_KEY,
});

async function downloadImage(url: string) {
  const filePath = resolve(process.cwd(), "public", "test.png");
  const file = createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve); // Close the file stream when finished
        console.log("Image downloaded and saved!");
      });
    }).on("error", (err) => {
      console.error("Error downloading image:", err);
      reject(err);
    });
  });
}

// convert script scene to AI image
export async function textToImage(prompt: string) {
  console.log("Generating image from script:", prompt);
  const modelId = "ByteDance/SDXL-Lightning";
  const width = 512;
  const height = 512;
  const guidanceScale = 7.5;
  const negativePrompt = "";
  const safetyCheck = true;
  const seed = 0;
  const numInferenceSteps = 50;
  const numImagesPerPrompt = 1;

  const result = await livepeerAI.generate.textToImage({
    modelId,
    prompt,
    width,
    height,
    guidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
  });

  // revalidatePath("/");

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}

// convert scribble scene to AI image
export async function imageToImage(prompt: string, imageData: string) {
  // convert base64 image to ArrayBuffer
  const base64 = imageData.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  console.log("Array buffer:", arrayBuffer);

  const result = await livepeerAI.generate.imageToImage({
    image: { fileName: "test.png", content: arrayBuffer },
    prompt: prompt,
    modelId: "timbrooks/instruct-pix2pix",
  });

  console.log("Image to image result:", result.imageResponse);

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}

// after image is selected by user, convert to video
export async function imageToVideo(imageUrl: string) {
  await downloadImage(imageUrl);

  const publicDir = path.join(process.cwd(), "public");
  const imagePath = path.join(publicDir, "test.png");

  const result = await livepeerAI.generate.imageToVideo({
    image: await openAsBlob(imagePath),
    modelId: "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
  });

  console.log("Image to video result:", result.videoResponse?.images);

  if (result.videoResponse?.images) {
    const images = result.videoResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}
