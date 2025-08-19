import { auth } from "@/auth";
import BinMap from "@/components/BinMap";
import LoadingIndicator from "@/components/LoadingIndicator";
import ScanQR from "@/components/ScanQR";
import TestNotification from "@/components/TestNotification";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  console.log("home session", session)
  if (session && !session?.user?.nic) {
    redirect('/profile/complete-profile')
  }
  return (
    <div className="relative">
      <div className="text-2xl font-bold">
        {session && <TestNotification userId={session.user.email} />}
        <Suspense fallback={<LoadingIndicator/>}>
          <BinMap />
        </Suspense>
        <ScanQR />
      </div>
    </div>
  );
}
