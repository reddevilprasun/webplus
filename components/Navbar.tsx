"use client";
import { useCurrentUser } from '@/app/(auth)/features/auth/api/user-current';
import { useAuthActions } from '@convex-dev/auth/react';
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
  User
} from '@nextui-org/react';
import { Loader, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = {
  id?: string;
  role?:string;
  number?:string;
  image?:string;
  name?:string;
  email?:string;
}

export default function NavBar() {
  const router = useRouter();
  const { data, isLoading} = useCurrentUser();
  const { signOut } = useAuthActions();

  return (
    <Navbar>
      <NavbarBrand>
        <Image
          src={"/icons/logo.png"}
          width={200}
          height={200}
          alt="Logo"
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-9" justify="center">
        <NavbarItem >Home</NavbarItem>
        <NavbarItem>Services</NavbarItem>
        <NavbarItem >About</NavbarItem>
        <NavbarItem >Contact</NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        {!data && (
          <NavbarItem>
            <Button>
              <Link href={"/sign-up"}>
                Sign Up
              </Link>
            </Button>
          </NavbarItem>
        )}
        {data && (
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
                <DropdownItem key="settings">
                  My Settings
                </DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">
                  Analytics
                </DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem startContent={<LogOut />} className={"text-danger"} key="logout" color="danger">
                  <button onClick={() => signOut()}>Logout</button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}

      </NavbarContent>
    </Navbar>
  );
}