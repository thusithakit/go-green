import Link from "next/link"
import { Button } from "./ui/button"
import { ScanQrCode } from "lucide-react"

const ScanQR = () => {
    return (
        <div className="absolute bottom-[40px] w-full">
            <Button asChild className="relative bg-green-500 cursor-pointer mx-auto flex flex-wrap justify-center content-center max-w-fit px-10 py-2 h-fit">
                <Link href="/scanbin">
                    <ScanQrCode size={150} />
                    <span className="font-bold text-xl">Scan the QR to Open</span>
                </Link>
            </Button>
        </div>
    )
}

export default ScanQR