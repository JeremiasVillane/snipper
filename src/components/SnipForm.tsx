"use client";

import { useUrlValidation } from "@/hooks";
import { createUrl } from "@/server-actions";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SnipForm({
  userEmail,
}: {
  userEmail: string;
}): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | null>();
  const [inputUrl, setInputUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isValid, setUrl } = useUrlValidation();
  const [protocol, setProtocol] = useState<string>("https://");

  const handleProtocol = () => {
    protocol === "https://" ? setProtocol("http://") : setProtocol("https://");
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(`${protocol}${newUrl}`);
    setInputUrl(newUrl);
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputUrl) {
      const { data, statusCode, error } = await createUrl(
        `${protocol}${inputUrl}`,
        userEmail
      );

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
              label={`Enter a ${
                !isValid && inputUrl?.length ? "valid" : ""
              } URL`}
              variant="faded"
              labelPlacement="outside"
              className="select-none"
              startContent={
                <div
                  className="flex items-center select-none cursor-pointer"
                  title="Change protocol"
                  onClick={handleProtocol}
                >
                  <span className="text-default-400 text-small">
                    {protocol}
                  </span>
                </div>
              }
              color={!isValid && inputUrl?.length ? "danger" : "default"}
              onChange={handleUrlChange}
              isInvalid={
                !isValid && inputUrl !== undefined && inputUrl.length > 0
              }
              autoComplete="off"
              required
            />

            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid || !inputUrl}
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
