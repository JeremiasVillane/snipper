"use server";

import { prisma } from "@/libs";

export default async function deleteLink(urlCode: string) {
  try {
    await prisma.url.delete({
      where: { urlCode },
    });

    return {
      statusCode: 200,
      error: null,
      data: {
        message: "Link removed successfully!",
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      error: {
        message: "Error deleting link",
      },
      data: null,
    };
  }
}
