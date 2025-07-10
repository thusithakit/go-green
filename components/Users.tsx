'use client';
import { db } from '@/app/lib/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<{ [userId: string]: boolean }>({});

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
      .filter(user => user.role !== 'admin');
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };
  const toggleUserRole = async (userId: string, currentRole: string) => {
    setButtonLoading(prev => ({ ...prev, [userId]: true }));
    const newRole = currentRole === 'user' ? 'collector' : 'user';

    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { role: newRole });

        // Refresh the list
        setUsers(prev =>
        prev.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        )
        );
    } catch (error) {
        console.error('Error updating role:', error);
    }
    setButtonLoading(prev => ({ ...prev, [userId]: false }));
    };


  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Registered Users</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Name:</strong> {user.name || 'N/A'}</p>
              <p><strong>Role:</strong> {buttonLoading[user.id]? 'Updating...' :(user.role || 'N/A')}</p>
              {user.role !== 'admin' && (
                <button
                    onClick={() => toggleUserRole(user.id, user.role || 'user')}
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {buttonLoading[user.id] ? 'Updating...': `Change to ${user.role === 'user'?'Collector':'User'}`}
                </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
