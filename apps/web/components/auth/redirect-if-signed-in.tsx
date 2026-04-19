"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectIfSignedIn({ to }: { to: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(to);
    }
  }, [isLoaded, isSignedIn, router, to]);

  return null;
}
