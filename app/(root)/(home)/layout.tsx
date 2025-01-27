import NavBar from '@/components/Navbar';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Webplus+",
  description: "Website security organization",
  icons: {
    icon: '/icons/symbol.png'
  }
};

const layoutRoot = ({children}: {children :ReactNode}) => {
  return (
    <main className='dark bg-[#1E2656] text-white'>
      <NavBar/>
      {children}
    </main>
  )
}

export default layoutRoot
