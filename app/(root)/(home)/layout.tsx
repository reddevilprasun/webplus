import NavBar from '@/components/Navbar';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Hostel & PG",
  description: "Hostel & PG",
  icons: {
    icon: '/icons/logo.svg'
  }
};

const layoutRoot = ({children}: {children :ReactNode}) => {
  return (
    <main>
      <NavBar/>
      {children}
    </main>
  )
}

export default layoutRoot
