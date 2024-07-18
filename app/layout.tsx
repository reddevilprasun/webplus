import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { SessionProvider } from 'next-auth/react'
import { auth } from "@/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Webplus+",
  description: "Website security organization",
  icons: {
    icon: '/icons/symbol.png'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster richColors/>
          {children}
        </Providers>
      </body>
    </html>
    </SessionProvider>
  );
}
