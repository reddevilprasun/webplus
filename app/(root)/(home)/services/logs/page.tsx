"use client";
import React from 'react'
import dynamic from 'next/dynamic'

const LogTable = dynamic(() => import('../components/LogTable'), { ssr: false })


const LogsViewPage = () => {
  return (
    <div className='m-8 space-y-6'>
      <h1 className=' text-3xl font-bold'>Logs</h1>
      <LogTable/>
    </div>
  )
}

export default LogsViewPage
