import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiKeyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Key Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>Use this key to authenticate your API requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input value="your-api-key-here" readOnly />
            <Button className="bg-gradient-to-b from-cyan-600 to-sky-400 text-white" variant="outline">Copy</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-gradient-to-b from-cyan-600 to-sky-400 text-white">Regenerate API Key</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Your current API usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Requests this month</span>
              <span className="font-semibold">5,432 / 10,000</span>
            </div>
            <div className="flex justify-between">
              <span>Data transferred</span>
              <span className="font-semibold">1.2 GB / 5 GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

