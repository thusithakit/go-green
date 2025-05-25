import { auth } from "@/auth";
import BinUnlockButton from "@/components/BinUnlockButton";
import SignUpButton from "@/components/SignUpButton";

const page = async ({ params }: { params: Promise<{ binId: string }> }) => {
    const { binId } = await params;
    const session = await auth();
    if (!session || !session?.user) {
    return <SignUpButton callbackUrl={`/bins/${binId}`} />
    }
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap content-center justify-center">
            <h1>This is bin:{binId}</h1>
            <BinUnlockButton binId={binId} />
        </div>
    )
}

export default page