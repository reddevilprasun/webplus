"use client";
import { useCurrentUser } from "@/app/(auth)/features/auth/api/user-current";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
} from "@nextui-org/react";
import Link from "next/link"; // Make sure you're importing from next/link
import { Loader, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/react";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const pathName = usePathname();
  const isActive = (path: string) => pathName.startsWith(path);

  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  return (
    <Navbar
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-3",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-cyan-400",
          "data-[active=true]:after:shadow-[1px_1px_14px_1px_#15dffa]",
          "text-white",
        ],
        base: ["backdrop-blur-sm", "bg-white/30"],
      }}
    >
      <NavbarBrand>
        {/* <Image src={"/icons/logo.png"} width={200} height={200} alt="Logo" /> */}
        <p className=" text-3xl font-bold">Web</p>
        <p className=" text-3xl text-cyan-400 font-bold">plu+</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-9" justify="center">
        <NavbarItem isActive={pathName === "/"}>
          <Link href="/" passHref>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive("/dashboard")}>
          <Link href="/dashboard" passHref>
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive("/services")}>
          <Link href="/services" passHref>
            Services
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive("/about")}>
          <Link href="/about" passHref>
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive("/contact")}>
          <Link href="/contact" passHref>
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {isLoading && (
          <NavbarItem>
            <Spinner />
          </NavbarItem>
        )}
        {!data && !isLoading ? (
          <NavbarItem>
            <Button className="bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa]">
              <Link href="/sign-up" passHref>
                Sign Up
              </Link>
            </Button>
          </NavbarItem>
        ) : (
          !isLoading &&
          data && (
            <NavbarItem>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <div className=" flex gap-2 items-center">
                    <Avatar
                      src={data.image}
                      showFallback
                      color={
                        data.subscriptionType === "free" ? "default" : "warning"
                      }
                      isBordered
                    />
                    <div className="flex flex-col justify-center">
                      <div className="flex gap-1 items-center">
                        <p className="font-bold">{`${data.firstName} ${data.lastName}`}</p>
                        <p className={cn("text-[9px] rounded-full px-2",
                          data.subscriptionType !== "free" ? "bg-[#facc15] shadow-[1px_1px_18px_1px_#facc15]" : " border border-white")}>
                          {data.subscriptionType === "free" ? "Free" : "Premium"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-50">{data.email}</p>
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">{data.email}</p>
                  </DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    startContent={<LogOut />}
                    className={"text-danger"}
                    key="logout"
                    color="danger"
                  >
                    <button onClick={() => signOut()}>Logout</button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )
        )}
      </NavbarContent>
    </Navbar>
  );
}
