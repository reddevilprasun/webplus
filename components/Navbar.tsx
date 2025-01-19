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

export default function NavBar() {
  const pathName = usePathname();
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();
  console.log(data);

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
          "data-[active=true]:after:bg-blue-500",
        ],
      }}
    >
      <NavbarBrand>
        <Image src={"/icons/logo.png"} width={200} height={200} alt="Logo" />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-9" justify="center">
        <NavbarItem isActive={pathName === "/"}>
          <Link href="/" passHref>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === "/dashboard"}>
          <Link href="/dashboard" passHref>
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === "/services"}>
          <Link href="/services" passHref>
            Services
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === "/about"}>
          <Link href="/about" passHref>
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === "/contact"}>
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
            <Button>
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
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: data.image,
                    }}
                    className="transition-transform"
                    description={data.email}
                    name={data.firstName + " " + data.lastName}
                  />
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
