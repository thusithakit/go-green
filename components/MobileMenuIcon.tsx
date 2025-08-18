'use client'
import { MenuIcon } from "lucide-react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import NavLinks from "./NavLinks";
import { usePathname } from "next/navigation";

const MobileMenuIcon = () => {
    const[isOpen, setIsOpen] = useState<boolean>(false);
    const session = useSession().data;
    const pathname = usePathname();
    useEffect(()=>{
        setIsOpen(false);
    },[pathname])
  return (
        <>
            <MenuIcon className='text-green-400' onClick={()=>setIsOpen(prevState => !prevState)}/>
            {isOpen && (
                <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg z-20 px-[20px] py-4">
                    <NavLinks session={session} />
                </div>
            )}
        </>
  )
}

export default MobileMenuIcon
