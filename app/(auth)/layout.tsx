import { Metadata } from 'next';
import React, { ReactNode } from 'react'
import { Vortex } from './components/ui/vortex';


export const metadata: Metadata = {
  title: "Webplus+",
  description: "Webplus",
  icons: {
    icon: '/icons/symbol.png'
  }
};
const Authlayout = ({children}: {children: ReactNode}) => {
  return (
    <Vortex
        backgroundColor="black"
        className="flex items-center justify-center w-full h-full"
      >
        {children}
    </Vortex>
  )
}

export default Authlayout
