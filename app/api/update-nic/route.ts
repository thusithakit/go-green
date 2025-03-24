import { NextResponse } from "next/server";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const { nic } = await req.json();
    const session = await auth();
    const userId = (session?.user?.email)?.toString();

    if (userId) {
        await updateDoc(doc(db, "users", userId), { nic });
    }
    return NextResponse.json({ message: "NIC updated successfully!" });
}