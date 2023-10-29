import { customAlphabet } from "nanoid";

export default (host: string) => {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    9
  );
  const urlCode = nanoid();

  return {
    urlCode,
    shortUrl: `${host}/${urlCode}`,
  };
};
