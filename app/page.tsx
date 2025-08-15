import { auth } from "@/auth";
import BinMap from "@/components/BinMap";
import ScanQR from "@/components/ScanQR";
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
        {/* {session ? <h1>Hello, {session?.user?.name}!</h1> : <h1>Please Login to Enjoy GoGreen</h1>} */}
        <Suspense fallback="Loadingggggg...">
          <BinMap />
        </Suspense>
        <ScanQR />
      </div>
    </div>
  );
}
