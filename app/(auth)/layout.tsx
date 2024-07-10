import { Metadata } from 'next';
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { BackgroundGradientAnimation } from './components/ui/greedientbackground';


export const metadata: Metadata = {
  title: "Webplus+",
  description: "Webplus",
  icons: {
    icon: '/icons/symbol.png'
  }
};
const Authlayout = ({children}: {children: ReactNode}) => {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center">
        {children}
      </div>
    </BackgroundGradientAnimation>
  )
}

export default Authlayout
