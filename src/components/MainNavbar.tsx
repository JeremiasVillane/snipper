"use client";

import { classNames } from "@/libs";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, ThemeToggle, UserMenu } from ".";

export default function Example() {
  const { data: session } = useSession();
  const currentPath = usePathname();

  const navigation = [
    { name: "New Link", href: "/new", current: currentPath === "/new" },
    { name: "My Links", href: "/mylinks", current: currentPath === "/mylinks" },
    { name: "About", href: "/about", current: currentPath === "/about" },
  ];

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
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                {/*********************/}
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={"/"}>
                    <Image
                      src="/snipper.png"
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
                              ? "bg-blue-500 dark:bg-blue-900 text-white"
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
                            ? "bg-gray-500 dark:bg-gray-900 text-white"
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
                      ? "bg-gray-500 dark:bg-gray-900 text-white"
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

// import {
//   Link,
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenu,
//   NavbarMenuItem,
//   NavbarMenuToggle,
// } from "@nextui-org/react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import NextLink from "next/link";
// import { usePathname } from "next/navigation";
// import SnipperLogo from "public/snipper.png";
// import { useState } from "react";
// import { ThemeToggle, UserMenu } from ".";

// export default function MainNavbar(): JSX.Element {
//   const currentPath = usePathname();
//   const { data: session } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   return (
//     <Navbar onMenuOpenChange={setIsMenuOpen} className="z-50 select-none">
//       <NavbarContent>
//         <NavbarMenuToggle
//           aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//           className="sm:hidden"
//         />
//         <Link href={"/"} color="foreground" as={NextLink}>
//           <NavbarBrand>
//             <Image
//               src={SnipperLogo}
//               alt="Snipper"
//               width={33}
//               height={33}
//               className="dark:invert mx-4"
//             />
//             <p className="font-bold text-inherit hidden sm:flex">SNIPPER</p>
//           </NavbarBrand>
//         </Link>
//       </NavbarContent>

//       <NavbarContent className="hidden sm:flex gap-4" justify="center">
//         {session && session.user ? (
//           <>
//             <NavbarItem isActive={currentPath === "/new"}>
//               <Link
//                 color={currentPath === "/new" ? "primary" : "foreground"}
//                 href="/new"
//                 as={NextLink}
//               >
//                 New link
//               </Link>
//             </NavbarItem>
//             <NavbarItem isActive={currentPath === "/mylinks"}>
//               <Link
//                 color={currentPath === "/mylinks" ? "primary" : "foreground"}
//                 href="/mylinks"
//                 as={NextLink}
//               >
//                 My links
//               </Link>
//             </NavbarItem>
//           </>
//         ) : null}
//         <NavbarItem isActive={currentPath === "/about"}>
//           <Link
//             color={currentPath === "/about" ? "primary" : "foreground"}
//             href="/about"
//             as={NextLink}
//           >
//             About
//           </Link>
//         </NavbarItem>
//       </NavbarContent>
//       <NavbarContent justify="end">
//         <NavbarItem>
//           <ThemeToggle />
//         </NavbarItem>
//         <NavbarItem>
//           <UserMenu />
//         </NavbarItem>
//       </NavbarContent>
//       <NavbarMenu>
//         {session && session.user ? (
//           <>
//             <NavbarMenuItem>
//               <Link
//                 className="w-full"
//                 href="/new"
//                 size="lg"
//                 color={currentPath === "/new" ? "primary" : "foreground"}
//                 as={NextLink}
//               >
//                 New link
//               </Link>
//             </NavbarMenuItem>
//             <NavbarMenuItem>
//               <Link
//                 className="w-full"
//                 href="/mylinks"
//                 size="lg"
//                 color={currentPath === "/mylinks" ? "primary" : "foreground"}
//                 as={NextLink}
//               >
//                 My Links
//               </Link>
//             </NavbarMenuItem>
//           </>
//         ) : null}
//         <NavbarMenuItem>
//           <Link
//             className="w-full"
//             href="/about"
//             size="lg"
//             color={currentPath === "/about" ? "primary" : "foreground"}
//             as={NextLink}
//           >
//             About
//           </Link>
//         </NavbarMenuItem>
//       </NavbarMenu>
//     </Navbar>
//   );
// }
