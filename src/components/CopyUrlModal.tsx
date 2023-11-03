"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CopyIcon } from ".";

const host = process.env.NEXT_PUBLIC_APP_URL;

export default function CopyUrlModal({
  showModal,
  setShowModal,
  code,
}: {
  showModal: boolean;
  setShowModal: any;
  code: string;
}): JSX.Element {
  const router = useRouter();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setIsCopy(true);
    } else {
      setIsCopy(false);
    }
  };

  const handleClose = (path?: string) => {
    setShowModal(false);
    setIsCopy(false);
    path && router.push(path);
  };

  return (
    <Modal
      isOpen={showModal}
      hideCloseButton
      placement="top-center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Copy your new link
          </ModalHeader>
          <ModalBody>
            <div className="relative">
              <Input
                autoFocus
                endContent={
                  <CopyIcon
                    color="gray"
                    className="flex-shrink-0 cursor-pointer"
                    onClick={handleCopyUrl}
                  />
                }
                variant="bordered"
                value={`${host}/${code}`}
                ref={inputRef}
                readOnly
              />
              {isCopy && (
                <div className="absolute bottom-9 right-4 bg-zinc-600 text-white p-2 rounded-lg text-sm z-50">
                  URL copied!
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={() => handleClose()}>
              Close
            </Button>
            <Button color="primary" onPress={() => handleClose("/new")}>
              New
            </Button>
            <Button color="primary" onPress={() => handleClose("/mylinks")}>
              My links
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
