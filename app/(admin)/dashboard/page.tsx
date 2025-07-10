import { auth } from '@/auth'
import Users from '@/components/Users';
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
      </div>
    </div>
  )
}

export default page
