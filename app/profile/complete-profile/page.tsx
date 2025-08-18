'use client'
import LoadingIndicator from '@/components/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { toast } from 'sonner';

const Page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [nic, setNic] = useState("");
    async function updateNIC() {
        const response = await fetch("/api/update-nic", {
            method: "POST",
            body: JSON.stringify({ nic }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            router.push("/")
            toast("NIC added Successfully!");
        }
    }

    return (
        <Suspense fallback={<LoadingIndicator/>}>
            <div className='relative h-full w-full flex content-center justify-center flex-wrap pt-[70px]'>
                <Card className="max-w-[350px] w-full mt-[50px]">
                    <CardHeader>
                        <CardTitle><h1>Welcome, {session?.user?.name}!</h1></CardTitle>
                        <CardDescription>You are One Step Away from completing your profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex relative flex-col gap-5'>
                            <Input type="text" placeholder="Enter Your NIC Number" onChange={(e) => setNic(e.target.value)} required />
                            <Button onClick={updateNIC}>Complete my Profile!</Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className='text-center relative w-full'>Let&apos;s track closest Garbage Bin!</p>
                    </CardFooter>
                </Card>
            </div>
        </Suspense>
    )
}

export default Page