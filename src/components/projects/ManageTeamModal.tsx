import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { User } from ".prisma/client"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, UserPlus, Activity } from "lucide-react"

interface ManageTeamModalProps {
  projectId: string
  members: (User & {
    tasks?: { status: string }[]
  })[]
  owner: User
}

export function ManageTeamModal({ projectId, members, owner }: ManageTeamModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Manage Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Team Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <form className="flex gap-2">
              <Input
                placeholder="member@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">Invite</Button>
            </form>

            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  {member.id !== owner.id && (
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              {members.map((member) => {
                const completedTasks = member.tasks?.filter(t => t.status === 'COMPLETED').length || 0
                const totalTasks = member.tasks?.length || 0
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                return (
                  <div key={member.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {completedTasks} of {totalTasks} tasks
                      </p>
                    </div>
                    <Progress value={progress} />
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}