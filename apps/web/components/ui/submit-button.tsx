"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  loadingText,
  className
}: {
  children: ReactNode;
  loadingText: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} className={className} disabled={pending} type="submit">
      {pending ? loadingText : children}
    </button>
  );
}
