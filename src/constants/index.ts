export const navigator = (path: string) => {
  return [
    { name: "New Link", href: "/new", current: path === "/new" },
    { name: "My Links", href: "/mylinks", current: path === "/mylinks" },
    { name: "About", href: "/about", current: path === "/about" },
  ];
};
