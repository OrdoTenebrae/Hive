import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check } from "lucide-react"

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  price: string
  installed: boolean
  features: string[]
  onInstall: () => void
}

export function ModuleCard({
  title,
  description,
  icon,
  price,
  installed,
  features,
  onInstall
}: ModuleCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <Badge variant={installed ? "secondary" : "outline"}>
          {price === "0" ? "Free" : `$${price}/mo`}
        </Badge>
      </div>

      <ul className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <Button 
        className="w-full" 
        variant={installed ? "outline" : "default"}
        onClick={onInstall}
        disabled={installed}
      >
        {installed ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Installed
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Install Module
          </>
        )}
      </Button>
    </Card>
  )
}