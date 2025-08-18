'use client'
import { useLongPress } from 'use-long-press';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { onValue, push, ref, set, update } from 'firebase/database';
import { database } from "@/app/lib/firebase-realtime";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from './LoadingIndicator';

interface Bin {
    id: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    level: number;
}

const BinUnlockButton = ({ binId }: { binId: string }) => {
    const bin = "bin" + binId;
    const binRef = ref(database, `/bins/${bin}`)
    const [binData, setBinData] = useState<Bin | null>(null)
    const [usersCanUnlock, setUsersCanUnlock] = useState(true);
    const { data } = useSession();
    const userRole = data?.user.role;
    const userEmail = data?.user.email;
    const userKey = userEmail?.replace(/\./g, '_');
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onValue(binRef, (snapshot) => {
            if (snapshot.exists()) {
                setBinData(snapshot.val());
            } else {
                setBinData(null)
            }
        });
        return () => unsubscribe();
    }, [binId,binRef])
    useEffect(() => {
        if (binData && binData.level >= 85) {
            console.log(binData)
            setUsersCanUnlock(false);
        }
    }, [binData])
    const click = useLongPress(async () => {
        if(!data){
            toast("You must be logged in");
            return router.push("/");
        }
        try {
            const disposalRef = push(ref(database, `disposals/${userKey}`));
            const disposalId = disposalRef.key;
            await set(disposalRef, {
                userId: data.user.email,
                binId: `bin${binId}`,
                timestamp: new Date().toISOString(),
                status: 'pending',
                heightChange: null
            });
            await update(binRef, {
                isOpen: true,
                currentDisposalId: disposalId,
                currentUserKey: userKey
            })
            toast("Bin Unlocked!", { duration: 1000 })
            return router.push('/profile');
        } catch (err) {
            toast("Error Occurred!", { duration: 1000 })
            console.log(err);
        }
    }, { threshold: 1000 })
    if (!data) {
        return <LoadingIndicator/>;
    }
    return (
        <div>
            {(usersCanUnlock || userRole == "admin" || userRole == "collector") ? (
                <div {...click()} className='cursor-pointer bin-button w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-green-300 rounded-full flex flex-col justify-center items-center flex-wrap gap-[10px] sm:gap-[20px] transition-colors duration-1000 delay-200 active:bg-green-500'>
                    <Trash size={100} color='#fff' className='block mx-auto' />
                    <h1 className='text-xl sm:text-4xl font-bold text-white'>Unlock</h1>
                </div>
            ) : (
                <div>
                    <h1>This bin is over {binData?.level}% full. Please Find another bin!</h1>
                </div>
            )}
        </div>
    )
}

export default BinUnlockButton