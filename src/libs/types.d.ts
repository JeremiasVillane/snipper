import { Url, User } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface currentUser extends User {
    urls: [Url];
    email: string;
  }

  interface Session {
    user: currentUser;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
