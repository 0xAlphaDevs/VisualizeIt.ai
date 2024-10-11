"use server";

// import path from "node:path";
// import { openAsBlob } from "node:fs";
// import { writeFileSync } from "node:fs";
import { Livepeer } from "@livepeer/ai";
import { revalidatePath } from "next/cache";

const livepeerAI = new Livepeer({
  httpBearer: "",
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
