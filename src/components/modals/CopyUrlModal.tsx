"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { Button, CopyIcon } from "..";

const host = process.env.NEXT_PUBLIC_APP_URL;

export default function CopyUrlModal({
  showModal,
  setShowModal,
  code,
}: {
  showModal: boolean;
  setShowModal: any;
  code: string;
}): React.JSX.Element {
  const router = useRouter();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  let inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef(null);

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
    path && router.refresh();
  };

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={closeButtonRef}
        onClose={() => handleClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-zinc-900 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto select-none">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 text-left shadow-xl dark:shadow-zinc-950 transition-all sm:my-8 sm:w-max sm:max-w-lg">
                <div className="bg-white dark:bg-zinc-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Copy your new link
                      </Dialog.Title>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          className="text-ellipsis w-full sm:w-[25rem] px-4 py-2 pr-10 text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-zinc-800 rounded-lg focus:outline-none"
                          value={`${host}/${code}`}
                          ref={inputRef}
                          readOnly
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 text-gray-400 dark:text-gray-200">
                          <CopyIcon
                            className="flex-shrink-0 cursor-pointer hover:brightness-125"
                            onClick={handleCopyUrl}
                          />
                        </div>
                        {isCopy && (
                          <div className="absolute bottom-9 right-4 bg-zinc-600 text-white p-2 rounded-lg text-sm z-50">
                            URL copied!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    size="sm"
                    color="primary"
                    className="w-full sm:mt-0 sm:w-auto"
                    onClick={() => handleClose("/mylinks")}
                  >
                    My Links
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    className="mt-2 w-full sm:mt-0 sm:w-auto sm:mr-2"
                    onClick={() => handleClose("/new")}
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    color="secondary"
                    className="mt-2 w-full sm:mt-0 sm:w-auto sm:mr-2"
                    onClick={() => handleClose()}
                    ref={closeButtonRef}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// import {
//   Button,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { useRef, useState } from "react";
// import { CopyIcon } from ".";

// const host = process.env.NEXT_PUBLIC_APP_URL;

// export default function CopyUrlModal({
//   showModal,
//   setShowModal,
//   code,
// }: {
//   showModal: boolean;
//   setShowModal: any;
//   code: string;
// }): JSX.Element {
//   const router = useRouter();
//   const [isCopy, setIsCopy] = useState<boolean>(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleCopyUrl = () => {
//     if (inputRef.current) {
//       navigator.clipboard.writeText(inputRef.current.value);
//       setIsCopy(true);
//     } else {
//       setIsCopy(false);
//     }
//   };

//   const handleClose = (path?: string) => {
//     setShowModal(false);
//     setIsCopy(false);
//     path && router.push(path);
//   };

//   return (
//     <Modal
//       isOpen={showModal}
//       hideCloseButton
//       placement="top-center"
//       motionProps={{
//         variants: {
//           enter: {
//             y: 0,
//             opacity: 1,
//             transition: {
//               duration: 0.3,
//               ease: "easeOut",
//             },
//           },
//           exit: {
//             y: -20,
//             opacity: 0,
//             transition: {
//               duration: 0.2,
//               ease: "easeIn",
//             },
//           },
//         },
//       }}
//     >
//       <ModalContent>
//         <>
//           <ModalHeader className="flex flex-col gap-1">
//             Copy your new link
//           </ModalHeader>
//           <ModalBody>
//             <div className="relative">
//               <Input
//                 autoFocus
//                 endContent={
//                   <CopyIcon
//                     color="gray"
//                     className="flex-shrink-0 cursor-pointer"
//                     onClick={handleCopyUrl}
//                   />
//                 }
//                 variant="bordered"
//                 value={`${host}/${code}`}
//                 ref={inputRef}
//                 readOnly
//               />
//               {isCopy && (
//                 <div className="absolute bottom-9 right-4 bg-zinc-600 text-white p-2 rounded-lg text-sm z-50">
//                   URL copied!
//                 </div>
//               )}
//             </div>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="danger" variant="flat" onPress={() => handleClose()}>
//               Close
//             </Button>
//             <Button color="primary" onPress={() => handleClose("/new")}>
//               New
//             </Button>
//             <Button color="primary" onPress={() => handleClose("/mylinks")}>
//               My links
//             </Button>
//           </ModalFooter>
//         </>
//       </ModalContent>
//     </Modal>
//   );
// }
