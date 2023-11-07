"use client";

import { navigator } from "@/constants";
import { classNames } from "@/libs";
import { Disclosure } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon, MenuIcon, ThemeToggle, UserMenu } from ".";

export default function MainNavbar() {
  const { data: session } = useSession();
  const currentPath = usePathname();
  const navigation = navigator(currentPath);

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 select-none">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-400 hover:bg-gray-200 hover:dark:bg-gray-700 hover:text-black hover:dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                {/*********************/}
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={"/"}>
                    <Image
                      src="/snipper.svg"
                      alt="Snipper"
                      width={33}
                      height={33}
                      className="dark:invert h-8 w-auto hover:opacity-75"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {session && session.user ? (
                      navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-400 dark:bg-gray-900 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 hover:text-gray-900 hover:dark:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <Link
                        key="About"
                        href="/about"
                        className={classNames(
                          currentPath === "/about"
                            ? "bg-gray-400 dark:bg-gray-900 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 hover:text-gray-900 hover:dark:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={
                          currentPath === "/about" ? "page" : undefined
                        }
                      >
                        About
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ThemeToggle />
                <UserMenu session={session} />
              </div>
            </div>
          </div>

          {/*    Mobile menu    */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-blue-400 dark:bg-gray-900 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 hover:text-gray-900 hover:dark:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          {/*********************/}
        </>
      )}
    </Disclosure>
  );
}
