import { ServiceSidebar } from "./components/ServiceSideBar";

export default function ServicePageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className=" flex h-screen overflow-hidden">
      <ServiceSidebar />
      <main className="flex-1 overflow-y-auto bg-[#1E2656]">
        {children}
      </main>
    </div>
  )
}
