import Link from "next/link";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <Ghost className="h-16 w-16 text-muted-foreground mb-6" />

      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>

      <p className="text-muted-foreground mb-6 max-w-md">
        Sorry, the page you’re looking for doesn't exist or has been moved.
      </p>

      <Link href="/">
        <Button className="p-3 cursor-pointer">Go Home</Button>
      </Link>
    </div>
  );
}
