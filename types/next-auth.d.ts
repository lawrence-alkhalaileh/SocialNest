import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    image?: string;
  }

  interface Session {
    user: User & {
      username: string;
      image?: string; 
    };
    token: {
      username: string;
      image?: string;
    };
  }
}
