import { IDBPDatabase, openDB } from "idb";

const DB_NAME = "shortlinkDB";
const DB_VERSION = 1;
const STORE_NAME = "qrPreferences";

interface QrPreferences {
  shortCode: string;
  fgColor: string;
  bgColor: string;
  logoDataUrl: string | null;
}

let db: IDBPDatabase<unknown>;

async function initDB(): Promise<IDBPDatabase<unknown>> {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "shortCode" });
        }
      },
    });
  }
  return db;
}

export async function saveQrPreferences(
  shortCode: string,
  preferences: Omit<QrPreferences, "shortCode">,
): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await store.put({ shortCode, ...preferences });
    await tx.done;
    console.log(`QR preferences saved for ${shortCode}`);
  } catch (error) {
    console.error(`Failed to save QR preferences for ${shortCode}:`, error);
  }
}

export async function loadQrPreferences(
  shortCode: string,
): Promise<QrPreferences | undefined> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const preferences = await store.get(shortCode);
    await tx.done;
    return preferences as QrPreferences | undefined;
  } catch (error) {
    console.error(`Failed to load QR preferences for ${shortCode}:`, error);
    return undefined;
  }
}

export async function deleteQrPreferences(shortCode: string): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.delete(shortCode);
    await tx.done;
    console.log(`QR preferences deleted for ${shortCode}`);
  } catch (error) {
    console.error(`Failed to delete QR preferences for ${shortCode}:`, error);
  }
}

// Helper to convert Data URL to File object for the file uploader hook
// This is needed to populate the useFileUpload hook's state from a loaded data URL
export async function dataURLtoFile(
  dataurl: string,
  filename: string,
): Promise<File> {
  if (!dataurl.startsWith("data:")) {
    throw new Error("Invalid data URL format");
  }

  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error("Invalid MIME type in data URL");
  }

  const mime = mimeMatch ? mimeMatch[1] : "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const blob = new Blob([u8arr], { type: mime });
  return new File([blob], filename, { type: mime });
}
