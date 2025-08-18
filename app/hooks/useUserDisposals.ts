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
  const [isLoading,setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userEmail) return;

    const userKey = userEmail.replace(/\./g, '_');
    const disposalsRef = ref(database, `disposals/${userKey}`);

    const unsubscribe = onValue(disposalsRef, (snapshot) => {
      const data: Record<string, Disposal> = snapshot.val() || {};
      const disposals = Object.values(data);
      setUserDisposals(disposals);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return {data:userDisposals, isLoading};
};

export default useUserDisposals;
