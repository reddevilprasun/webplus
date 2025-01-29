"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useGetUserSubscriptionType } from "@/app/(root)/features/getUserSubscriptionStatus"

const initialBlockedIPs = [
  { id: 1, ip: "192.168.1.1", reason: "Suspicious activity", blockedAt: "2025-01-20T15:30:00Z" },
  { id: 2, ip: "10.0.0.1", reason: "Multiple failed login attempts", blockedAt: "2025-01-21T09:45:00Z" },
]

export default function IPBlockingPage() {
  const [blockedIPs, setBlockedIPs] = useState(initialBlockedIPs)
  const [newIP, setNewIP] = useState("")
  const [reason, setReason] = useState("")
  
  const { data: subscriptionType } = useGetUserSubscriptionType()
  if (subscriptionType?.subscriptionType !== "premium") {
    return (
      <div className="m-8">
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader>
            <CardTitle>Upgrade to Premium</CardTitle>
            <CardDescription className="text-white">
              Upgrade to a premium subscription to generate an API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/services/purchase-plans">
            <Button
              className="bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa] text-white"
            >
              Upgrade to Premium
            </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddIP = () => {
    if (newIP && reason) {
      setBlockedIPs([
        ...blockedIPs,
        {
          id: blockedIPs.length + 1,
          ip: newIP,
          reason: reason,
          blockedAt: new Date().toISOString(),
        },
      ])
      setNewIP("")
      setReason("")
    }
  }

  const handleRemoveIP = (id: number) => {
    setBlockedIPs(blockedIPs.filter((ip) => ip.id !== id))
  }

  return (
    <div className="space-y-6 m-8">
      <h1 className="text-3xl font-bold">IP Blocking</h1>
      <Card className="backdrop-blur-sm bg-white/20 text-white">
        <CardHeader>
          <CardTitle>Add IP to Blocklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input placeholder="Enter IP address" value={newIP} onChange={(e) => setNewIP(e.target.value)} className=" bg-transparent border-white" />
            <Input placeholder="Reason for blocking" value={reason} onChange={(e) => setReason(e.target.value)} className=" bg-transparent border-white" />
            <Button onClick={handleAddIP}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-sm bg-white/20 text-white">
        <CardHeader>
          <CardTitle>Blocked IP Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Blocked At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIPs.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell>{ip.ip}</TableCell>
                  <TableCell>{ip.reason}</TableCell>
                  <TableCell>{new Date(ip.blockedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveIP(ip.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

