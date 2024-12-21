import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, Brain, GitBranch, Users, Clock, FileText, Video } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/logo"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individual freelancers",
    features: [
      "Basic File Storage (500MB)",
      "Up to 2 Team Members",
      "1 Active Project",
      "Community Support"
    ]
  },
  {
    name: "Professional",
    price: "$19",
    description: "For growing teams",
    popular: true,
    features: [
      "Everything in Free, plus:",
      "Access to Pro Modules",
      "5GB Storage",
      "Up to 10 Team Members",
      "5 Active Projects",
      "Priority Support"
    ]
  },
  {
    name: "Business",
    price: "$35",
    description: "For large organizations",
    features: [
      "Everything in Professional, plus:",
      "Advanced AI Insights",
      "Access to all Modules",
      "Unlimited Projects",
      "24/7 Premium Support",
      "Enterprise Security"
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex-shrink-0 mr-16">
            <Link href="/" className="font-semibold text-xl tracking-tight">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-black hover:text-gray-900">Pricing</Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start with our free plan and upgrade as your team grows. All plans include our core features and your friendly assistant - <span className="text-amber-500 font-medium">Bee</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`p-8 relative border ${plan.popular ? 'border-amber-500' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full py-6 ${plan.popular 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900'}`}
                >
                  {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600">
              Need a custom plan? <Link href="/contact" className="text-amber-500 hover:text-amber-600 font-medium">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
