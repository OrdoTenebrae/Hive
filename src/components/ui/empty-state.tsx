import { ReactNode } from "react"
import { Card } from "./card"

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-primary-medium mb-6">{description}</p>
      {action}
    </Card>
  )
} 