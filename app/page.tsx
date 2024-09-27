import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Database, FileSpreadsheet, Zap } from "lucide-react"
import Link from "next/link"

export default function home() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <header className="px-4 lg:px-6 h-14 flex justify-between items-center w-full">
        <Link className="flex items-center justify-center" href="#">
          <FileSpreadsheet className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">SyncSage</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/syncview">
            SyncView
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 flex justify-center items-center flex-col">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Seamless Sync Between Google Sheets and PostgreSQL
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  SyncSage provides real-time synchronization, easy setup, and powerful integration for your data needs.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-primary text-primary-foreground">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Real-time Sync</h3>
                <p className="text-gray-500">Instantly update your database when changes occur in Google Sheets.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
                <p className="text-gray-500">Configure your sync in minutes with our user-friendly interface.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Database className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Powerful Integration</h3>
                <p className="text-gray-500">Seamlessly connect Google Sheets with your PostgreSQL database.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 SyncSage. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}