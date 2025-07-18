// app/password-reset/[uid]/[token]/page.tsx
import { PasswordResetConfirmForm } from "@/components/forms";

// Make it async and accept params as a Promise
export default async function Page({
  params,
}: {
  params: Promise<{ uid: string; token: string }>;
}) {
  const { uid, token } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* ... */}
      <PasswordResetConfirmForm uid={uid} token={token} />
    </div>
  );
}
