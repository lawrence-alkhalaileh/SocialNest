"use client";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "./button";

export default function SignOut() {
  return (
    <Button
      className={buttonVariants()}
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
    >
      Sign Out
    </Button>
  );
}
