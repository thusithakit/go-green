"use client"
import React from 'react'
import { logout } from '@/app/lib/actions/auth'
import { Button } from './ui/button'

const SignOutButton = () => {
    return (
        <Button onClick={logout} className='cursor-pointer w-full text-center'>Sign Out</Button>
    )
}

export default SignOutButton