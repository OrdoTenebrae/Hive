import { create } from 'zustand'
import { User } from '.prisma/client'

interface TeamStore {
  members: User[]
  setMembers: (members: User[]) => void
  addMember: (member: User) => void
  removeMember: (memberId: string) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),
  removeMember: (memberId) => set((state) => ({
    members: state.members.filter((m) => m.id !== memberId)
  }))
}))
