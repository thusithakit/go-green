import BinUnlockButton from "@/components/BinUnlockButton";

const page = async ({ params }: { params: { binId: string } }) => {
    const { binId } = await params;
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap content-center justify-center">
            <h1>This is bin:{binId}</h1>
            <BinUnlockButton binId={binId} />
        </div>
    )
}

export default page