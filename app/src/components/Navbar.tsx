"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import ProfileDropdown from './ProfileDropdown'
const navigationItems =  [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Fundees",
        href: "/fundees"
    },
    {
        name: "Funders",
        href: "/funders"
    },
    {
        name: "About",
        href: "/about"
    }
    
]
const Navbar = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <nav className="flex justify-between items-center p-4 relative">
        {/* Logo */}
        <div>
            Logo
        </div>
        <NavRight pathname={pathname} isLoggedIn={isLoggedIn} />
    </nav>
  )
}

const NavRight = ( {pathname, isLoggedIn}: {pathname: string, isLoggedIn: boolean}) => {
    return (
        <div className="flex items-center gap-6 px-10">
            {navigationItems.map((item) => (
                <Link href={item.href} key={item.name} 
                className={cn("text-sm font-medium transition-colors hover:text-blue-600", {'text-blue-500': pathname === item.href })}>
                    {item.name}
                </Link>
            ))}
            <div className="flex items-center gap-2 px-2">
                {!isLoggedIn && (
                    <Button asChild variant="ghost" size="sm" className="gap-2 transition-all duration-300">
                        <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                        </Link>
                    </Button>
                )}
                <ProfileDropdown />
            </div>
            
        </div>
    )
}


 export default Navbar