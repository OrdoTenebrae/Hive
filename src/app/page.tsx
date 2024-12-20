"use client"

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Brain, GitBranch, BarChart2, Users, Zap, Lock, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    const canvas = document.getElementById('hero-pattern') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const drawPattern = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fafafa';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw subtle grid pattern
          ctx.strokeStyle = '#f0f0f0';
          ctx.lineWidth = 1;
          
          const gridSize = 30;
          for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
              if (Math.random() > 0.5) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.stroke();
              }
            }
          }
        };

        drawPattern();
        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drawPattern();
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold text-xl tracking-tight">
              Hive
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section - Full screen */}
        <section className="min-h-[calc(100vh-4rem)] relative flex items-center border-b overflow-hidden">
          <canvas 
            id="hero-pattern" 
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.4 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-8 inline-block">
                <div className="rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium text-gray-900">
                  Just Launched: AI Task Scheduling
                </div>
              </div>
              <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-8">
                AI-Powered Project
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"> Management</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Streamline collaboration, automate workflows, and unlock insights with our intelligent project management platform.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/signup" 
                  className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 font-medium text-lg inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#demo" 
                  className="border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-lg hover:border-gray-300 font-medium text-lg transition-all">
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Full screen */}
        <section id="features" className="min-h-screen flex items-center bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-4xl font-bold text-center mb-20">Enterprise-Grade Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <Card key={i} className="p-8 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="min-h-screen flex items-center border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-4xl font-bold text-center mb-20">Trusted by Industry Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center mb-24">
              {/* Add company logos here */}
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="text-2xl font-medium text-gray-900 mb-8">
                "Hive has transformed how we manage projects. The AI insights are game-changing."
              </blockquote>
              <cite className="text-gray-600 block">
                <span className="font-medium text-gray-900">Sarah Johnson</span>
                <br />
                CTO at TechCorp
              </cite>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/guides" className="text-gray-600 hover:text-gray-900">Guides</Link></li>
                <li><Link href="/api" className="text-gray-600 hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
            <p className="text-gray-600">© 2024 Hive. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Insights",
    description: "Get intelligent suggestions for task division and project optimization with our advanced AI algorithms."
  },
  {
    icon: <GitBranch className="w-8 h-8" />,
    title: "GitHub Integration",
    description: "Seamlessly connect your repositories for automatic commit analysis and progress tracking."
  },
  {
    icon: <BarChart2 className="w-8 h-8" />,
    title: "Analytics",
    description: "Track team velocity, completion rates, and project health metrics in real-time."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Team Management",
    description: "Dynamic role assignment and workload balancing for optimal team performance."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Real-time Updates",
    description: "Stay in sync with live task status updates and instant collaboration features."
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "Bank-grade security with role-based access control and data encryption."
  }
];
