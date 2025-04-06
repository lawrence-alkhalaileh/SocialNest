"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

export function ImageUpload() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 mr-2 animate-spin" />
          Uploading...
        </>
      ) : (
        "Upload Image"
      )}
    </Button>
  );
}
