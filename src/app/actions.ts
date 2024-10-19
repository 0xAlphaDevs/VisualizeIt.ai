"use server";

import path from "node:path";
import { openAsBlob } from "node:fs";
// import { writeFileSync } from "node:fs";
import { Livepeer } from "@livepeer/ai";
import { revalidatePath } from "next/cache";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { get } from "https";

const livepeerAI = new Livepeer({
  httpBearer: process.env.LIVEPEER_API_KEY,
});

export async function textToImage(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const modelId = formData.get("modelId") as string;
  const width = parseInt(formData.get("width") as string);
  const height = parseInt(formData.get("height") as string);
  const guidanceScale = parseFloat(formData.get("guidanceScale") as string);
  const negativePrompt = formData.get("negativePrompt") as string;
  const safetyCheck = formData.get("safetyCheck") === "true";
  const seed = parseInt(formData.get("seed") as string);
  const numInferenceSteps = parseInt(
    formData.get("numInferenceSteps") as string
  );
  const numImagesPerPrompt = parseInt(
    formData.get("numImagesPerPrompt") as string
  );
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

  revalidatePath("/");

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

export async function testTextToImage(prompt: string) {
  // const modelId = "ByteDance/SDXL-Lightning";
  // const width = 512;
  // const height = 512;
  // const guidanceScale = 7.5;
  // const negativePrompt = "";
  // const safetyCheck = true;
  // const seed = 0;
  // const numInferenceSteps = 50;
  // const numImagesPerPrompt = 1;
  // const imageResult = await livepeerAI.generate.textToImage({
  //   modelId,
  //   prompt,
  //   width,
  //   height,
  //   guidanceScale,
  //   negativePrompt,
  //   safetyCheck,
  //   seed,
  //   numInferenceSteps,
  //   numImagesPerPrompt,
  // });

  // const imageUrl =
  //   imageResult.imageResponse?.images[0].url ||
  //   "https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_640.jpg";

  // await downloadImage(imageUrl);

  console.log("Prompt:", prompt);

  const publicDir = path.join(process.cwd(), "public");
  const imagePath = path.join(publicDir, "test.png");

  const result = await livepeerAI.generate.imageToVideo({
    image: await openAsBlob(imagePath),
  });

  console.log("Image to video result:", result.videoResponse);

  // if (result.imageResponse?.images) {
  //   const images = result.imageResponse.images.map((image) => image.url);
  //   return {
  //     success: true,
  //     images,
  //   };
  // } else {
  //   return {
  //     success: false,
  //     images: [],
  //     error: "Failed to generate images",
  //   };
  // }
}
