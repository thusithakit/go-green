'use client'
import { useLongPress } from 'use-long-press';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { onValue, ref, update } from 'firebase/database';
import { database } from "@/app/lib/firebase-realtime";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SignUpButton from './SignUpButton';

interface Bin {
    id: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    level: number;
}

const BinUnlockButton = ({ binId }: { binId: string }) => {
    let bin = "bin" + binId;
    const binRef = ref(database, `/bins/${bin}`)
    const [binData, setBinData] = useState<Bin | null>(null)
    const [usersCanUnlock, setUsersCanUnlock] = useState(true);
    const { data } = useSession();
    const userRole = data?.user.role;
    useEffect(() => {
        const unsubscribe = onValue(binRef, (snapshot) => {
            if (snapshot.exists()) {
                setBinData(snapshot.val());
            } else {
                setBinData(null)
            }
        });
        return () => unsubscribe();
    }, [binId])
    useEffect(() => {

        if (binData && binData.level >= 85) {
            console.log(binData)
            setUsersCanUnlock(false);
        }
    }, [binData])
    const click = useLongPress(async () => {
        try {
            await update(binRef, {
                isOpen: true,
            })
            toast("Bin Unlocked!", { duration: 1000 })
        } catch (err) {
            toast("Error Occurred!", { duration: 1000 })
            console.log(err);
        }
    }, { threshold: 1000 })
    return (
        <div>
            {(usersCanUnlock || userRole == "admin" || userRole == "collector") ? (
                <div {...click()} className='cursor-pointer w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-green-300 rounded-full flex flex-col justify-center content-center flex-wrap gap-[10px] sm:gap-[20px] transition-colors duration-1000 delay-200 active:bg-green-500'>
                    <Trash size={100} color='#fff' className='block mx-auto' />
                    <h1 className='text-2xl sm:text-4xl font-bold text-white'>Hold Me</h1>
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