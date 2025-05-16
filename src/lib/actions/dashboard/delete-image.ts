"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { utapi } from "@/lib/uploadthing";

import { authActionClient } from "../safe-action";

const deleteImageSchema = z.object({
  imgsToRemove: z.string().or(z.array(z.string())),
});

export const deleteImage = authActionClient({
  roles: ["USER"],
  plans: ["Business"],
})
  .metadata({
    name: "upload-image",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 10,
      requested: 1,
    },
  })
  .schema(deleteImageSchema)
  .action(async ({ parsedInput }) => {
    const { imgsToRemove } = parsedInput;

    const res = await utapi.deleteFiles(imgsToRemove);

    if (!res.success) {
      throw new Error("Error deleting images. Try again later.");
    }

    revalidatePath("/dashboard");
    return { message: "Image(s) deleted successfully" };
  });
