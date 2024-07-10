import { auth } from '@/auth'
import React from 'react'

const Home = () => {
  const session = async()=> await auth();
  return (
    <div>
      {JSON.stringify(session)}
    </div>
  )
}

export default Home
