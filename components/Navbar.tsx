import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Image from 'next/image';

export default function NavBar() {

  return (
    <Navbar>
      <NavbarBrand>
        <Image
          src={"/icons/logo.svg"}
          width={60}
          height={60}
          alt="Logo"
        />
        <p className="font-bold text-inherit pl-2">
          Zostel
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-9" justify="center">
        <NavbarItem >Home</NavbarItem>
        <NavbarItem >Rooms</NavbarItem>
        <NavbarItem>Services</NavbarItem>
        <NavbarItem >About</NavbarItem>
        <NavbarItem >Contact</NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          Book Now
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}