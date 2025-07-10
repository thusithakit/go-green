'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/app/lib/firebase-realtime';

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

  // Get user's current location
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

    const unsubscribe = onValue(binsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setIsLoading(false);
        return;
      }

      // ✅ Wrap async logic
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
        .filter((bin) => bin.level >= 70);


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
  }, []);

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
        <h2 className='text-2xl animate-ping'>Loading....</h2>
      </div>
    )
  }
  return (
    <div className="p-4 bg-white shadow-md rounded-md mt-15">
      <h1 className="text-xl font-bold mb-4">Filled Bins: {filledBins.length}</h1>
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
