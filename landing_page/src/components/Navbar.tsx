"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../public/logo.svg";
import ArrowIcon from "../../public/images/arrow.svg";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Home",
      href: "/",
      className: "text-[#F1F7F6]",
    },
    {
      name: "About",
      href: "/#about",
      className: "text-[#F1F7F6]",
    },
    {
      name: "Features",
      href: "/#features",
      className: "text-[#F1F7F6]",
    },
  ];
  return (
    <nav
      className="w-full px-6 py-4 "
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-end md:justify-between">
        <Link
          href="/"
          aria-label="Gasless Gossips page"
          className="hidden md:block"
        >
          <Image src={Logo} alt="Gasless Gossip Logo" width={64} height={48} />
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center text-[#F1F7F6] justify-center flex-1">
          <ul className="flex space-x-8" role="menubar">
            {navLinks.map((link) => (
              <li key={link.name} role="none">
                <Link
                  href={link.href}
                  role="menuitem"
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`group flex items-center gap-2 relative px-3 py-2 rounded-md hover:text-[#7AF8EB] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49] ${
                    pathname === link.href
                      ? "font-semibold bg-[#7AF8EB]/30"
                      : ""
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Connect Button */}
        <button className="bg-[#121418] text-[#F1F7F6] w-fit h-[51] opacity-100 px-6 py-4 rounded-[32px] hover:bg-[#0F5951] shadow-[0px_1px_12px_0px_#0F5951_inset] flex items-center justify-center gap-4 ">
          <span className="font-medium text-sm text-center ">
            Connect Wallet
          </span>
          <Image src={ArrowIcon} alt="Arrow icon" width={24} height={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
