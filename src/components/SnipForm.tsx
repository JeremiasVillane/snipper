"use client";

import { createUrl } from "@/server-actions";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SnipForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>();
  const [inputUrl, setInputUrl] = useState<string | null>();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputUrl(e.target.value);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputUrl) {
      const { data, statusCode, error } = await createUrl(inputUrl);

      if (statusCode === 200) {
        router.push(`/success?code=${data.urlCode}`);
        setError(null);
      } else {
        setError(error?.message);
      }
    }
  };

  return (
    <form
      className="max-w-[600px] w-full flex justify-center my-4 mx-auto"
      onSubmit={handleOnSubmit}
    >
      <div className="flex flex-col w-full relative">
        <input
          type="text"
          placeholder="Enter a URL"
          className={`border border-solid p-4 rounded-l-lg w-full ${
            error && "border-rose-600"
          }`}
          onChange={handleOnChange}
          required
        />

        {error && (
          <div className="text-xs text-red-600 my-2 absolute top-14">
            {error}
          </div>
        )}
      </div>

      <input
        type="submit"
        className="bg-sky-700 font-bold text-white p-4 rounded-r-lg cursor-pointer"
        value="Snip URL"
      />
    </form>
  );
}
