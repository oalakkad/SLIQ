"use client";

import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice";
import { useSocialAuth } from "@/hooks";
import { Spinner } from "@/components/common";
import { Suspense } from "react";

function SocialAuthHandler() {
  const [facebookAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth(facebookAuthenticate, "facebook");

  return (
    <div className="my-8">
      <Spinner lg />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="my-8">
          <Spinner lg />
        </div>
      }
    >
      <SocialAuthHandler />
    </Suspense>
  );
}
