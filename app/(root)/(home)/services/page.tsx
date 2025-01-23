import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

const benefits = [
  "Advanced Analytics Dashboard",
  "Unlimited API Requests",
  "24/7 Priority Support",
  "Custom Integrations",
  "Team Collaboration Tools",
  "Enhanced Security Features",
]

const testimonials = [
  {
    quote: "Webplus has revolutionized how we handle our API management. It's a game-changer!",
    author: "Jane Doe, CTO of TechCorp",
  },
  {
    quote: "The analytics provided by Webplus have given us insights we never knew we needed. Highly recommended!",
    author: "John Smith, Lead Developer at InnovateCo",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Supercharge Your API Management
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Webplus provides powerful tools for API analytics, monitoring, and optimization. Take control of your APIs
            and boost your application&apos;s performance.
          </p>
          <div className="mt-8">
            <Link href="/dashboard/purchase-plans">
              <Button size="lg" className="text-lg px-8 py-3 bg-gradient-to-b from-cyan-600 to-sky-400">
                Upgrade to Premium <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Premium Benefits</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {benefit}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Unlock the full potential of your APIs with our premium features.</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-8">
                  <p className="text-lg font-medium text-gray-900 mb-4">&quot;{testimonial.quote}&quot;</p>
                  <p className="text-base text-gray-500">- {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-gray-500 mb-8">
            Join thousands of developers who trust Webplus for their API management needs.
          </p>
          <Link href="/services/purchase-plans">
            <Button size="lg" className="text-lg px-8 py-3 bg-gradient-to-b from-cyan-600 to-sky-400">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2025 Webplus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

