'use client'

import { db } from "@/app/lib/firebase";
import { database } from "@/app/lib/firebase-realtime";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { onValue, ref } from "firebase/database";
import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { MinusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  bins?: string[];
  [key: string]: unknown;
}
type Bin = {
    id: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    level: number;
}

const ManageAssignedBins = () => {
  const [users, setUsers] = useState<User[]>([]);
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const userList: User[] = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as User))
            .filter(user => user.role === 'collector');
            setUsers(userList);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
  };
    useEffect(() => {
      fetchAllUsers();
      const binRef = ref(database, "/bins");
        const unsubscribe = onValue(binRef, (snapshot) => {
            if (snapshot.exists()) {
                const binsData = snapshot.val();
                const binsArray = Object.keys(binsData).map((key) => ({
                    id: key,
                    ...binsData[key],
                }));
                setBins(binsArray);
            } else {
                setBins([]);
            }
        });
        return () => unsubscribe();
    }, []);
    const availableBins = (user:User)=>{
        return bins.filter(bin => !(user.bins?.includes(bin.id)));
    } 
    if(loading){
    return (
      <div className='mt-20 w-full h-auto flex items-center justify-center'>
        <LoadingIndicator/>
      </div>
    )
  }
  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Name:</strong> {user.name || 'N/A'}</p>
              <div><strong>Assigned Bins:</strong>
                {user.bins && user.bins.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.bins.map((bin,_index)=>(
                            <div key={_index} className="flex justify-between items-center gap-4 max-w-[150px] border p-2 rounded border-gray-400">
                                {bin}
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        setLoading(true)
                                        const userRef = doc(db, "users", user.id);
                                        await updateDoc(userRef, {
                                            bins: arrayRemove(bin),
                                        });
                                        fetchAllUsers();
                                        setLoading(false)
                                    }}
                                    className="h-6 w-6 rounded-full"
                                >
                                    <MinusIcon/>
                                </Button>
                            </div>
                        ))}
                    </div>
                ):<p>No bins Assigned!</p>}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button>Assign a new Bin</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="grid grid-cols-3 gap-2">
                            {availableBins(user).length > 0 ? (
                                availableBins(user).map((bin) => (
                                    <Button
                                        key={bin.id}
                                        onClick={async () => {
                                        const userRef = doc(db, "users", user.id);
                                        await updateDoc(userRef, {
                                            bins: arrayUnion(bin.id),
                                        });
                                        fetchAllUsers();
                                        }}
                                        className="block w-full mb-2"
                                    >
                                        {bin.id}
                                    </Button>
                                ))
                            ):<p>No bins available to assign!</p>}
                        </div>
                    </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageAssignedBins
