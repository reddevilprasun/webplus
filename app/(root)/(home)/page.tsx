import { auth, signOut } from '@/auth'
import Upload from '@/components/upload';
import { Button } from '@nextui-org/react';
import React from 'react'

const Home = async () => {
  const session = await auth();
  return (
    <div>
      <Upload/>
    </div>
  )
}

export default Home
