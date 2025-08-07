import { auth } from '@/auth'
import Users from '@/components/Users';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();
    if(!session || session.user.role !="admin"){
        redirect("/");
    }
  return (
    <div className='mt-20'>
      <div>
        <h2>Users</h2>
        <Users/>
        <h2>Manage Collectors</h2>
        <Link href='/dashboard/collectors' className='text-blue-500 hover:underline'>Go to Collectors</Link>
      </div>
    </div>
  )
}

export default page
