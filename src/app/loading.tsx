import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="font-serif text-sm text-secondary tracking-widest uppercase">
          Loading Taptah...
        </span>
      </div>
    </div>
  );
}
