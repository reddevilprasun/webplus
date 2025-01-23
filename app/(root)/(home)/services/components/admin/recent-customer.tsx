import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentCustomers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "premium" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "normal" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "premium" },
  { id: 4, name: "David Lee", email: "david@example.com", status: "normal" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", status: "blocked" },
]

export function RecentCustomers() {
  return (
    <div className="space-y-8">
      {recentCustomers.map((customer) => (
        <div key={customer.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${customer.email}`} alt={customer.name} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto">
            <Badge
              variant={
                customer.status === "premium" ? "default" : customer.status === "blocked" ? "destructive" : "secondary"
              }
            >
              {customer.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

