"use client";

import { Button, Link } from "@nextui-org/react";
import { Url } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";
import { useState } from "react";
import {
  AnchorIcon,
  CopyUrlModal,
  DeleteIcon,
  DeleteLinkModal,
  Redirector,
  ShareIcon,
} from ".";
import resetLinkClicks from "@/server-actions/reset-link-clicks";
import { useRouter } from "next/navigation";

export default function SnipCards({ urls }: { urls: [Url] }): JSX.Element {
  const router = useRouter();
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>("");

  const handleShare = (urlCode: string) => {
    setShowCopyModal(true);
    setCurrentCode(urlCode);
  };

  const handleDelete = async (urlCode: string) => {
    setShowDeleteModal(true);
    setCurrentCode(urlCode);
  };

  const handleResetClicks = async (urlId: string, urlClicks: number) => {
    if (urlClicks === 0) return;

    await resetLinkClicks(urlId);
    router.refresh();
  };

  return (
    <>
      {urls ? (
        urls.map((url: Url, index: number) => (
          <div
            key={index}
            className="relative group  block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-slate-300 dark:bg-slate-800/[0.8] block  rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-br from-white to-slate-300/[0.2] dark:from-slate-800 dark:to-slate-800/[0.2] border border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-700 relative z-20">
              <div className="relative z-20">
                <div id="icons" className="flex justify-between">
                  <ShareIcon
                    name="Share"
                    width="21"
                    height="21"
                    color="rgb(59 130 246)"
                    className="cursor-pointer"
                    onClick={() => handleShare(url.urlCode)}
                  />
                  <DeleteIcon
                    name="Delete"
                    width="21"
                    height="21"
                    color="rgb(157 23 77)"
                    className="cursor-pointer"
                    onClick={() => handleDelete(url.urlCode)}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-zinc-600 dark:text-zinc-100 font-bold tracking-wide mt-4">
                    <Redirector code={url.urlCode}>{url.urlCode}</Redirector>
                    {/* <Link href={shortUrl} isExternal showAnchorIcon as={NextLink}>
                {urlCode}
              </Link> */}
                  </h4>
                  <div className="mt-8 text-zinc-500 tracking-wide leading-relaxed text-sm">
                    <p className="select-none">
                      <b>Original URL:</b>
                    </p>

                    <Link
                      href={url.originalUrl}
                      isExternal
                      showAnchorIcon
                      anchorIcon={
                        <AnchorIcon width="18" height="18" color="#0661cc" />
                      }
                      as={NextLink}
                    >
                      <input
                        type="text"
                        readOnly
                        className="bg-transparent text-ellipsis cursor-pointer"
                        value={url.originalUrl}
                      />
                    </Link>

                    <p className="mt-3 select-none">
                      <b>Created:</b>
                    </p>
                    <p className="text-zinc-400 select-none">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-end justify-between">
                      <p className="mt-3 select-none">
                        <b>Total clicks:</b>{" "}
                        <span className="text-zinc-400 select-none">
                          {url.clicks}
                        </span>
                      </p>

                      <Button
                        size="sm"
                        color="primary"
                        className="p-1.5 transform hover:bg-blue-500 duration-200"
                        onClick={() => handleResetClicks(url.id, url.clicks)}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No urls</p>
      )}
      <CopyUrlModal
        showModal={showCopyModal}
        setShowModal={setShowCopyModal}
        code={currentCode}
      />
      <DeleteLinkModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        code={currentCode}
      />
    </>
  );
}
