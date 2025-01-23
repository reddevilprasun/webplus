import Link from "next/link"
import { Home, Users, Tag, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-white hover:bg-gray-700", "flex items-center space-x-3")}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}

