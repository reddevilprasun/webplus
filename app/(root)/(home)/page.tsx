import { auth, signOut } from '@/auth'
import { Button } from '@nextui-org/react';
import React from 'react'

const Home = async () => {
  const session = await auth();
  return (
    <div>
      Your Session: {JSON.stringify(session)}
      <form action={
        async () => {
          "use server"
          await signOut();
        }
      }>

        <Button type='submit'>
          Sign out
        </Button>
      </form>
    </div>
  )
}

export default Home
