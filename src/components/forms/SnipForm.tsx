"use client";

import React from "react";
import { useUrlValidation } from "@/hooks";
import { createLink } from "@/server-actions";
import { Card, CardBody, Input } from "@nextui-org/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, CopyUrlModal } from "..";

export default function SnipForm({
  userEmail,
}: {
  userEmail: string;
}): React.JSX.Element {
  const [error, setError] = useState<string | null>();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [protocol, setProtocol] = useState<string>("https://");
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState<string>("");
  const { isValid, setUrl } = useUrlValidation();

  const handleProtocol = () => {
    protocol === "https://" ? setProtocol("http://") : setProtocol("https://");
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newUrl = e.target.value;

    if (newUrl.startsWith("https://")) {
      newUrl = newUrl.substring(8);
      setProtocol("https://");
    } else if (newUrl.startsWith("http://")) {
      newUrl = newUrl.substring(7);
      setProtocol("http://");
    }

    setUrl(`${protocol}${newUrl}`);
    setInputUrl(newUrl);
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputUrl) {
      const { data, statusCode, error } = await createLink(
        `${protocol}${inputUrl.toLowerCase()}`,
        userEmail
      );

      if (statusCode === 200) {
        setShowModal(true);
        setNewCode(data.urlCode);
        setError(null);
        setInputUrl("");
      } else {
        setError(error?.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg bg-gradient-to-br from-white to-slate-400/[0.2] dark:from-slate-800 dark:to-slate-800/[0.2] border border-transparent hover:border-slate-300 dark:hover:border-slate-700 mx-2 md:w-[550px]">
        <CardBody>
          <form
            className="w-full flex justify-center my-4 mx-auto"
            onSubmit={handleOnSubmit}
          >
            <div className="flex items-end w-full relative gap-x-2">
              <Input
                type="text"
                label={`${
                  error
                    ? error
                    : `Enter a ${
                        !isValid && inputUrl?.length ? "valid" : ""
                      } URL`
                }`}
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
                color={
                  (!isValid && inputUrl?.length) || error ? "danger" : "default"
                }
                value={inputUrl}
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
                size="md"
                width="5"
                className="overflow-visible"
                disabled={!isValid || !inputUrl}
                isLoading={isLoading}
              >
                Create
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <CopyUrlModal
        showModal={showModal}
        setShowModal={setShowModal}
        code={newCode}
      />
    </>
  );
}
