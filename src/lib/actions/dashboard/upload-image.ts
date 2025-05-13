"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { utapi } from "@/lib/uploadthing";

import { authActionClient } from "../safe-action";

const uploadImageSchema = z.object({
  file: z.instanceof(File),
});

export const uploadImage = authActionClient({
  roles: ["USER"],
  plans: ["Business"],
})
  .metadata({
    name: "upload-image",
    limiter: {
      refillRate: 5,
      interval: 15,
      capacity: 5,
      requested: 1,
    },
  })
  .schema(uploadImageSchema)
  .action(async ({ parsedInput }) => {
    const { file } = parsedInput;

    const res = await utapi.uploadFiles(file);

    if (res.error) {
      throw new Error("Error uploading image. Try again later.");
    }

    revalidatePath("/dashboard");

    return res.data.ufsUrl;
  });
