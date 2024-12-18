import { Search as SearchIcon } from "lucide-react"
import { Input } from "../ui/input"

export function Search() {
  return (
    <div className="relative w-96">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search projects, tasks, and team members..."
        className="pl-8 bg-gray-50 border-0 focus-visible:ring-1"
      />
    </div>
  )
}