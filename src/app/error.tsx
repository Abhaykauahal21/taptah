"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
        Notice
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">
        Something Went Wrong
      </h2>
      <p className="text-sm text-secondary max-w-md mb-8">
        We encountered an unexpected error while preparing this experience.
      </p>
      <Button variant="primary" size="md" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
