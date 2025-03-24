import { auth } from '@/auth'
import QrCodeScanner from '@/components/QRScanner';
import SignUpButton from '@/components/SignUpButton';
import React from 'react'

const page = async () => {
    const session = await auth();
    let canOverride = false;
    if (!session?.user) {
        return <SignUpButton callbackUrl='/scanbin' />
    }
    if (session?.user.role === "admin" || session?.user.role === "collector") {
        canOverride = true;
    }
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap content-center justify-center">
            <h1>You {canOverride ? "can : override" : "can't : override"}</h1>
            <div className='w-full max-w-[400px] mx-auto relative'>
                <QrCodeScanner />
            </div>
        </div>
    )
}

export default page