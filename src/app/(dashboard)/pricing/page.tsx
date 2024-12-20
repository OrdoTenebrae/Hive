import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Up to 1 active project",
      "2 team members",
      "Basic task management",
      "500MB storage"
    ]
  },
  {
    name: "Professional",
    price: "$15",
    features: [
      "Up to 5 active projects",
      "10 team members",
      "GitHub integration",
      "AI task scheduler",
      "5GB storage"
    ]
  },
  {
    name: "Business",
    price: "$49",
    features: [
      "Unlimited projects",
      "50 team members",
      "Advanced AI insights",
      "GitHub commit summaries",
      "100GB storage"
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-primary-medium mt-2">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-primary-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full">
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
