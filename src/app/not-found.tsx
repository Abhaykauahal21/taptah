import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
        404 &middot; Not Found
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-4">
        Page Not Found
      </h1>
      <p className="text-sm text-secondary max-w-md mb-8">
        The bite you are looking for doesn&apos;t seem to exist or has moved.
      </p>
      <Link href="/">
        <Button variant="primary" size="md">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
