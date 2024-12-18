import { UserNav } from "./UserNav"
import { Search } from "./Search"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"

interface HeaderProps {
  user: {
    name: string | null;
    email: string;
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <Search />
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-700">
            <Bell className="w-5 h-5" />
          </Button>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}