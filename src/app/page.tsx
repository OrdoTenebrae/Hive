import Image from "next/image";
import Link from "next/link";
import Logo from "../components/logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                AI-Powered Project Management
              </h1>
              <p className="mt-6 text-lg text-primary-medium max-w-2xl mx-auto">
                Streamline your projects with AI insights, real-time collaboration, and intelligent workload management.
              </p>
              <div className="mt-10">
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
