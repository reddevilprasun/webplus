import { auth } from '@/auth';
import React from 'react'

const Dashboardpage = async() => {
  const session = await auth();
  return (
    <div>
      Your Session: {JSON.stringify(session)}
    </div>
  )
}

export default Dashboardpage;