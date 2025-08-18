'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/app/lib/firebase-realtime';
import { useSession } from 'next-auth/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import LoadingIndicator from '@/components/LoadingIndicator';

interface Bin {
  id: string;
  lat: number;
  lng: number;
  level: number;
}

const Page = () => {
  const [filledBins, setFilledBins] = useState<Bin[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [isLoading,setIsLoading]= useState<boolean>(false);
  const user = useSession().data?.user;
  const [assignedBins, setAssignedBins] = useState<string[]>([]);
  const [assignedBinsLoaded, setAssignedBinsLoaded] = useState<boolean>(false);

  
  useEffect(()=>{
    if (!user?.email) return;
    const fetchAssignedBins = async () => {
        try {
            const binsRef = doc(db, "users",user.email);
            const snapshot = await getDoc(binsRef);
            const userData = snapshot.data();
            setAssignedBins(userData?.bins || []);
            setAssignedBinsLoaded(true);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
        }
    };
    fetchAssignedBins();
  },[user]);

  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      alert("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const binsRef = ref(database, 'bins');
    if(assignedBinsLoaded){
          const unsubscribe = onValue(binsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setIsLoading(false);
        return;
      }

      (async () => {
        const bins: Bin[] = Object.entries(data)
        .map(([id, value]) => {
          const bin = value as Partial<Bin>;
          return {
            id,
            lat: bin.lat ?? 0,
            lng: bin.lng ?? 0,
            level: bin.level ?? 0,
          };
        })
        .filter((bin) => bin.level >= 70 && (assignedBins.length>0 ? assignedBins.includes(bin.id): true));


        const addressPromises = bins.map(async (bin) => {
          try {
            const res = await fetch(
              `/api/reverse-geocode?lat=${bin.lat}&lon=${bin.lng}`
            );
            const data = await res.json();
            console.log('bin location', data);
            return { id: bin.id, address: data.address || 'Unknown' };
          } catch (err) {
            console.error('Reverse geocode fetch failed:', err);
            return { id: bin.id, address: 'Unknown' };
          }
        });

        const resolved = await Promise.all(addressPromises);
        const newAddresses: Record<string, string> = {};
        resolved.forEach(({ id, address }) => {
          newAddresses[id] = address;
        });

        setAddresses(newAddresses);
        setFilledBins(bins);
        setIsLoading(false);
      })();
    });

    return () => unsubscribe();
    }
  }, [assignedBinsLoaded, assignedBins.join(',')]);

  // Handle Start Collecting
  const handleStartCollecting = () => {
    if (!currentLocation || filledBins.length === 0) {
      alert("Waiting for GPS or no filled bins available.");
      return;
    }

    const origin = `${currentLocation.lat},${currentLocation.lng}`;
    const destination = origin;
    const waypoints = filledBins.map(bin => `${bin.lat},${bin.lng}`).join('|');

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&waypoints=optimize:true|${waypoints}`;

    window.open(gmapsUrl, '_blank');
  };
  if(isLoading){
    return (
      <div className='mt-20 w-full h-auto flex items-center justify-center'>
        <LoadingIndicator/>
      </div>
    )
  }
  return (
    <div className="p-4 bg-white shadow-md rounded-md mt-15">
      <h1 className="text-2xl font-bold mb-4">Collector Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name || 'Collector'}!</p>
      <h1 className="text-xl font-bold mb-4">Filled Bins Assigned to You: {filledBins.length}</h1>
      <ul className="mb-4">
        {filledBins.map((bin) => (
          <li key={bin.id} className="text-sm mb-1">
            📍 Bin near <strong>{addresses[bin.id]}</strong> — 
            <strong> Level:</strong> {bin.level}%
          </li>
        ))}
      </ul>
      <button
        onClick={handleStartCollecting}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Start Collecting
      </button>
    </div>
  );
};

export default Page;
