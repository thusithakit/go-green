import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import { auth } from '@/auth';
import SignOutButton from './SignOutButton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';
import Logo from '@/public/logo.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const Navbar = async () => {
    const session = await auth();
    return (
        <header className='fixed top-0 left-0 w-full z-10 bg-white flex justify-between content-center gap-5 px-[40px] py-2 flex-wrap border-b-green-200 border-4 border-t-0 border-x-0'>
            <Link href="/" className='flex relative flex-wrap items-center justify-center gap-[10px]'>
                <Image src={Logo} alt='Go Green Logo' width={50} height={50} />
                <h1 className='text-3xl font-bold'><span className='text-green-400'>Go</span>Green</h1>
            </Link>
            <div className='flex content-center justify-end gap-5 flex-wrap'>
                <NavLinks session={session} />
                {session && session.user?.image && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={session.user.image} />
                                <AvatarFallback>GG</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem><SignOutButton /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    )
}

export default Navbar