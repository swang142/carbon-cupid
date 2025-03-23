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
const Navbar = () => {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <nav className= "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center p-4 relative">
            <Link 
                href="/" 
                className="text-xl font-semibold tracking-tight transition-colors animate-fade-in"
            >
                <span className="text-primary">cupid</span>
                <span>connect</span>
            </Link>
            
            <NavRight pathname={pathname} isLoggedIn={isLoggedIn} />
        </div>
    </nav>
  )
}

const NavRight = ( {pathname, isLoggedIn}: {pathname: string, isLoggedIn: boolean}) => {
    return (
        <div className="flex items-center gap-6 px-10">
            {navigationItems.map((item) => (
                <Link href={item.href} key={item.name} 
                className={cn("text-sm font-medium transition-colors hover:text-primary", {'text-primary': pathname === item.href })}>
                    {item.name}
                </Link>
            ))}
            <div className="flex items-center gap-2 px-2">
                {!isLoggedIn && (
                    <Button asChild variant="ghost" size="sm" className="gap-2 transition-all duration-300">
                        <Link href="/join">
                        <LogIn className="h-4 w-4" />
                        <span>Join</span>
                        </Link>
                    </Button>
                )}
                <ProfileDropdown />
            </div>
            
        </div>
    )
}


 export default Navbar