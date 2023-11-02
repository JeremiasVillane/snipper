"use client";

import { createUrl } from "@/server-actions";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";

export default function SnipForm({ userEmail }: { userEmail: string }): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | null>();
  const [inputUrl, setInputUrl] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputUrl(`https://${e.target.value}`);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputUrl) {
      const { data, statusCode, error } = await createUrl(inputUrl, userEmail);

      if (statusCode === 200) {
        router.push(`/success?code=${data.urlCode}`);
        setError(null);
      } else {
        setError(error?.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg mx-2">
      <CardBody>
        <form
          className="w-full flex justify-center my-4 mx-auto"
          onSubmit={handleOnSubmit}
        >
          <div className="flex items-end w-full relative gap-x-2">
            <Input
              type="text"
              label={`Enter a ${error ? "valid" : ""} URL`}
              variant="faded"
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">https://</span>
                </div>
              }
              color={error ? "danger" : "default"}
              onChange={handleOnChange}
              isInvalid={!!error === true}
              autoComplete="off"
              required
            />

            <Button
              color="primary"
              type="submit"
              isDisabled={!inputUrl} // || !!error === true}
              isLoading={isLoading}
            >
              Create Link
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
