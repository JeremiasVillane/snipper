"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

const host = process.env.NEXT_PUBLIC_APP_URL;

interface CopyUrlFormProps {
  code: string;
}

export default function CopyUrlForm({ code }: CopyUrlFormProps): JSX.Element {
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setIsCopy(true);
    } else {
      setIsCopy(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        className="max-w-[600px] w-full flex justify-center my-4 mx-auto flex-1"
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="border border-solid p-4 rounded-l-lg w-full"
          value={`${host}/${code}`}
          ref={inputRef}
          readOnly
        />

        <div className="relative">
          <input
            type="submit"
            className="bg-sky-700 font-bold text-white p-4 rounded-r-lg cursor-pointer"
            value="Copy URL"
          />

          {isCopy && (
            <div className="absolute top-16 left-2 bg-black text-white p-2 rounded-lg text-sm">
              URL copied!
            </div>
          )}
        </div>
      </form>

      <div className="flex flex-1 my-10 max-w-[600px] mx-auto">
        <span className="mr-2">See how many times your link got clicked</span>

        <Link href={`/analytics?code=${code}`} className="text-blue-300">
          Click here
        </Link>
      </div>
    </div>
  );
}
