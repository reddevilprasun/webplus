import { Monitor, ShieldAlert, Clock, Users } from "lucide-react"

const features = [
  {
    title: "Customized Security Solutions",
    description: "Tailored security measures for your specific needs",
    icon: Monitor,
  },
  {
    title: "Vulnerability Assessment",
    description: "Comprehensive system analysis and risk evaluation",
    icon: ShieldAlert,
  },
  {
    title: "24/7 Incident Response",
    description: "Round-the-clock monitoring and immediate action",
    icon: Clock,
  },
  {
    title: "User Training Programs",
    description: "Educational resources for security awareness",
    icon: Users,
  },
]

export function Features() {
  return (
    <section className="container py-24 bg-[#1E2656]">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg h-[780px] ">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent" />
          <img
            src="/images/web.png"
            alt="Security monitoring screen"
            className="h-full w-full object-cover"
            width={421}
            height={780}
          />
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400 drop-shadow-[1px_14px_14px_rgba(21, 223, 250, 1)]">FEATURE POINT</p>
            <h2 className="text-4xl font-bold tracking-tight text-white">Key Service Features Protecting You</h2>
            <p className="text-lg text-gray-300">
              We are providing many features to keep you secure in this digital world
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg bg-gray-900/50 p-6 backdrop-blur-sm hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all duration-300">
                <div className="mb-4 inline-block rounded-lg bg-cyan-400/10 p-3">
                  <feature.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

