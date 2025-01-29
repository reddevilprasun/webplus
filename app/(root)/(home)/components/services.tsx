import { Shield, AlertCircle, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    title: "Cyber security Assessment",
    icon: Shield,
    className: "border border-cyan-400/30",
  },
  {
    title: "Threat Detection and Prevention",
    icon: AlertCircle,
    className: "bg-gray-900/50",
  },
  {
    title: "Incident Response and Recovery",
    icon: History,
    className: "bg-gray-900/50",
  },
]

export function Services() {
  return (
    <section className="container py-12 bg-[#1E2656]">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">OUR SERVICE</p>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Supercharge Your API Management</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Webplus provides powerful tools for API analytics, monitoring, and optimization. Take control of your APIs and
          boost your application&#39;s performance.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
      {services.map((service) => (
          <div key={service.title} className={`relative rounded-2xl p-12 text-center ${service.className}`}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="inline-block rounded-full bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa] p-4">
                <service.icon className="h-7 w-7 text-gray-900" />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{service.title}</h3>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button size="lg" className="group bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa] text-lg font-semibold text-gray-900 hover:bg-cyan-500">
          <Link href={"/services/purchase-plans"}>
          Upgrade to Premium
          </Link>
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </section>
  )
}

