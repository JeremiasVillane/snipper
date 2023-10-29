import { customAlphabet } from "nanoid";

export default (host: string) => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 9);
  const urlCode = nanoid();

  return {
    urlCode,
    shortUrl: `${host}/api/${urlCode}`,
  };
};
