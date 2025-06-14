'use client';
import { useEffect, useState } from 'react';
import { database } from '@/app/lib/firebase-realtime';
import { ref, onValue } from 'firebase/database';

interface Disposal {
  userId: string;
  binId: string;
  timestamp: string;
  status: string;
  heightChange: number | null;
}

const useUserDisposals = (userEmail: string | undefined) => {
  const [userDisposals, setUserDisposals] = useState<Disposal[]>([]);

  useEffect(() => {
    if (!userEmail) return;

    const userKey = userEmail.replace(/\./g, '_');
    console.log("userkey",userKey)
    const disposalsRef = ref(database, `disposals/${userKey}`);

    const unsubscribe = onValue(disposalsRef, (snapshot) => {
      const data: Record<string, Disposal> = snapshot.val() || {};
      const disposals = Object.values(data);
      setUserDisposals(disposals);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return userDisposals;
};

export default useUserDisposals;
