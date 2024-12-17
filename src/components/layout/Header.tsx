import { UserNav } from "@/components/layout/UserNav"

export function Header() {
  return (
    <header className="border-b border-primary-light/10">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
