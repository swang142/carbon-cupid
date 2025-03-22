import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const ProfileDropdown = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className='w-8 h=8 rounded-full overflow-hidden'>
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
                test
            </AvatarFallback>
        </Avatar>
    </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuLabel>
            My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
    </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown