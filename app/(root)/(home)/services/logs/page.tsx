"use client";
import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetUserSubscriptionType } from '@/app/(root)/features/getUserSubscriptionStatus';

const LogTable = dynamic(() => import('../components/LogTable'), { ssr: false })


const LogsViewPage = () => {
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
  return (
    <div className='m-8 space-y-6'>
      <h1 className=' text-3xl font-bold'>Logs</h1>
      <LogTable/>
    </div>
  )
}

export default LogsViewPage
