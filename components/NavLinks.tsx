"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

interface NavLinksProps {
    session: any;
}

const NavLinks = ({ session }: NavLinksProps) => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || (pathname.startsWith(href) && href != "/");
    return (
        <nav className='relative flex content-center justify-end gap-5 flex-wrap'>
            <Link href="/" className={`${isActive("/") ? "text-green-500 font-bold" : "font-semibold"}`}>Home</Link>
            {!session && <Link href="/login" className={`${isActive("/login") ? "text-green-500 font-bold" : "font-semibold"}`}>Login</Link>}
        </nav>
    )
}

export default NavLinks