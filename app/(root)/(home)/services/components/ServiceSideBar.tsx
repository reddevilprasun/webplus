"use client";
import Link from "next/link";
import { Home, Key, FileText, Shield, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useGetUserSubscriptionType } from "@/app/(root)/features/getUserSubscriptionStatus";


const sidebarItems = [
  { name: "Preminum Dashboard", href: "/services", icon: Home, requiresPremium: false },
  {
    name: "API Key",
    href: "/services/api-key",
    icon: Key,
    requiresPremium: true,
  },
  {
    name: "Logs",
    href: "/services/logs",
    icon: FileText,
    requiresPremium: true,
  },
  {
    name: "IP Blocking",
    href: "/services/ip-blocking",
    icon: Shield,
    requiresPremium: true,
  },
  {
    name: "Purchase Plans",
    href: "/services/purchase-plans",
    icon: CreditCard,
    requiresPremium: false,
  },
];

export function ServiceSidebar() {
  const { data:userSubscription, isLoading } = useGetUserSubscriptionType();
  const pathName = usePathname();
  const isActiveLink = (href: string) => pathName === href;

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-cyan-500 to-sky-300 text-white">
      <div className="flex h-16 items-center justify-center border-b border-blue-500">
        <h1 className="text-2xl font-bold">Webplus</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map(
          (item) =>
            (userSubscription?.subscriptionType === "premium" || !item.requiresPremium) && (
              <Link key={item.name} href={`${item.href}`} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-2 text-white hover:bg-white/10",
                    "flex items-center space-x-3",
                    isActiveLink(item.href) && "bg-white/50 text-black"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            )
        )}
      </nav>
    </div>
  );
}
