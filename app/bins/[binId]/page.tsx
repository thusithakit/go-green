import { auth } from "@/auth";
import BinUnlockButton from "@/components/BinUnlockButton";
import SignUpButton from "@/components/SignUpButton";
import Link from "next/link";

const page = async ({ params }: { params: Promise<{ binId: string }> }) => {
    const { binId } = await params;
    const session = await auth();
    if (!session || !session?.user) {
    return <SignUpButton callbackUrl={`/bins/${binId}`} />
    }
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap items-center justify-center">
            {/* <h1>This is bin:{binId}</h1> */}
            <div className='py-5 px-5'>
                <p className='font-medium text-gray-600'>Press and Hold the unlock button for 2 seconds to unlock the bin.</p>
                <p className='font-medium text-gray-800 mt-5'>Want to go back? <Link href='/' className='underline text-green-500'>Click Here</Link></p>
            </div>
            <BinUnlockButton binId={binId} />
        </div>
    )
}

export default page