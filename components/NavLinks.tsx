"use client"
import { Session } from 'next-auth';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button';

interface NavLinksProps {
    session: Session | null;
}

const NavLinks = ({ session }: NavLinksProps) => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || (pathname.startsWith(href) && href != "/");
    return (
        <nav className='relative flex flex-col md:flex-row content-center justify-end gap-5 md:flex-wrap'>
            <Link href="/" className={`${isActive("/") ? "text-green-500 font-bold" : "font-semibold"}`}>Home</Link>
            {(session?.user.role=="admin" || session?.user.role=="collector") && (
                <Link href='/filled' className={`${isActive("/filled") ? "text-green-500 font-bold" : "font-semibold"}`}>Bins</Link>
            ) }
            {session?.user.role=="admin" && (
                <Link href='/dashboard' className={`${isActive("/dashboard") ? "text-green-500 font-bold" : "font-semibold"}`}>Admin Dashboard</Link>
            ) }

            {!session && (
                <Button asChild>
                    <Link href="/login" className={`${isActive("/login") ? "text-green-500 font-bold" : "font-semibold"}`}>Login</Link>
                </Button>
            )}
        </nav>
    )
}

export default NavLinks