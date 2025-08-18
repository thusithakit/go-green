import { auth } from '@/auth'
import QrCodeScanner from '@/components/QRScanner';
import SignUpButton from '@/components/SignUpButton';
import Link from 'next/link';
import React from 'react'

const page = async () => {
    const session = await auth();
    // let canOverride = false;
    if (!session?.user) {
        return <SignUpButton callbackUrl='/scanbin' />
    }
    // if (session?.user.role === "admin" || session?.user.role === "collector") {
    //     canOverride = true;
    // }
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap content-center justify-center">
            <div className='w-full max-w-[400px] mx-auto relative'>
                <QrCodeScanner />
            </div>
            <div className='py-5 px-5'>
                <p className='font-medium text-gray-600'>Point the camera toward the QR code displayed on the bin. Then press unlock button to unlock the bin.</p>
                <p className='font-medium text-gray-800 mt-5'>Want to go back? <Link href='/' className='underline text-green-500'>Click Here</Link></p>
            </div>
        </div>
    )
}

export default page