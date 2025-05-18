import { customAlphabet } from "nanoid";

const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";

// numbers between 6 and 9 have greater weight than between 10 and 15.
const lengthWeights: { [key: number]: number } = {
  6: 5,
  7: 5,
  8: 5,
  9: 5,
  10: 1,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
  15: 1,
};

function getRandomLength(): number {
  const entries = Object.entries(lengthWeights).map(([num, weight]) => ({
    num: Number(num),
    weight,
  }));
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const entry of entries) {
    if (randomWeight < entry.weight) {
      return entry.num;
    }
    randomWeight -= entry.weight;
  }

  // fallback
  return 6;
}

export function generateShortCode(): string {
  const isValid = (code: string): boolean => {
    if (/^[-_]/.test(code)) return false; // starts with - o _
    if (/[-_]$/.test(code)) return false; // ends with - o _
    if (/(--|__|-_|_-)/.test(code)) return false; // contains unallowed combinations
    return true;
  };

  while (true) {
    const length = getRandomLength();
    const nanoid = customAlphabet(ALPHABET, length);
    const code = nanoid();

    if (isValid(code)) {
      return code;
    }
  }
}
