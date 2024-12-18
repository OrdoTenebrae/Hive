"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback } from "@/components/ui/avatar"
  import { useRouter } from "next/navigation"
  
  interface UserNavProps {
    user: {
      name: string | null;
      email: string;
    }
  }
  
  export function UserNav({ user }: UserNavProps) {
    const router = useRouter()
    
    const getInitials = (name: string | null) => {
      if (!name) return user.email.substring(0, 2).toUpperCase()
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  
    const handleSignOut = () => {
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }