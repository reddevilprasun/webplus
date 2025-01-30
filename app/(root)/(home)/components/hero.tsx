import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="container flex flex-col items-center justify-center py-28 text-center">
      <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
        Comprehensive Security Solutions for Your Digital World
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-300">
        Advanced threat detection, real-time monitoring, and intelligent analysis to protect your digital assets 24/7
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
          <Link href="/sign-up" passHref>
          Get Started
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white bg-transparent text-white hover:bg-white hover:text-gray-900"
        >
          <Link href="/dashboard" passHref>
          View Demo
          </Link>
        </Button>
      </div>
    </div>
  )
}

