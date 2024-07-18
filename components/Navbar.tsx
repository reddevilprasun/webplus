"use client";
import { useCurrentUser } from '@/hooks/user-data';
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
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
  const user = useCurrentUser();
  const logout = async()=> {
    await signOut();
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Image
          src={"/icons/logo.png"}
          width={200}
          height={200}
          alt="Logo"
        />
        {/* <p className="font-bold text-inherit pl-2">
        </p> */}
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-9" justify="center">
        <NavbarItem >Home</NavbarItem>
        <NavbarItem >Rooms</NavbarItem>
        <NavbarItem>Services</NavbarItem>
        <NavbarItem >About</NavbarItem>
        <NavbarItem >Contact</NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        {!user && (
          <NavbarItem>
            <Button>
              <Link href={"/sign-in"}>
                Sign IN
              </Link>
            </Button>
          </NavbarItem>
        )}
        {user && (
          <NavbarItem>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: user?.image,
                  }}
                  className="transition-transform"
                  description={user?.email || user?.number}
                  name={user.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{user?.email || user?.number}</p>
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
                  <button onClick={logout}>Logout</button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}

      </NavbarContent>
    </Navbar>
  );
}