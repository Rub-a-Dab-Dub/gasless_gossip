'use client'

import {
  LogOut,
  X,
  Search,
} from 'lucide-react';
import { Dialog, DialogPanel } from '@headlessui/react'
import { usePathname } from "next/navigation";
import MobileProgresBar from "@/components/MobileProgresBar";


import Image from "next/image";

import gossipLogo from "@/images/logos/gossip.svg";
import logoMobile from "@/images/logos/logo.svg"

import { useState } from "react";
import Link from "next/link";

const navigation = [
  { name: 'home', href: '/'},
  { name: 'about', href: '#'},
  { name: 'home', href: '#'},
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 sm:border-b border-[#181E1D] z-100 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto md:px-0 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 hidden md:flex">
          <Image
            src={gossipLogo}
            alt="Gossip Logo"
            sizes="(min-width: 1024px) 32rem, 20rem"
          />
        </div>

        <div className="flex md:hidden">
          <MobileProgresBar />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-16">
          {navigation.map((item) => (
            <div className="text-center" key={item.name}>
              <Link
                href={item.href}
                className={`text-light-grey ${
                  item.href === pathname ? 'text-light-teal' : 'hover:text-light-grey'
                }`}
              >
                <span className="text-center">{item.name}</span>
              </Link>
            </div>
          ))}
        </nav>

        <Image
          src={logoMobile}
          alt="Gossip Logo"
          sizes="(min-width: 1024px) 32rem, 20rem"
          className="sm:hidden block"
        />

        {/* Desktop User ID and Logout */}
        <div className="hidden lg:flex items-center gap-3 border border-[#1A2221] rounded-full">
          <span className="text-xs text-gray-500 px-6">0x1234Hksko...5678</span>
          <button className="p-2 btn-glass-effect rounded-full">
            <LogOut
              className="aspect-square w-auto h-14 p-3"
            />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A2221]"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Search className="w-5 h-5 text-gray-400"/>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="mt-48 z-50 fixed w-screen bottom-0 bg-dark-900 h-28 px-4 py-2 border-t border-teal drop-shadow-xl shadow-xl block sm:hidden">
        <div className="w-full grid grid-cols-5 items-center gap-2">
          {navigation.map((item) => (
            <div className="text-center flex flex-col items-center" key={item.name}>
              <Link
                href={item.href}
                className={`text-light-grey ${
                  item.href === pathname ? 'text-light-teal' : 'hover:text-light-grey'
                }`}
              >
                
                <span className="text-center">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#0a0f1a] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Image
              src={gossipLogo}
              alt="Gossip Logo"
              className="h-8 w-auto"
            />
            <button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A2221]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-800">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 ${
                      pathname === item.href
                        ? 'bg-[#0F5951] text-[#14F1D9]'
                        : 'text-[#A3A9A6] hover:bg-[#1A2221] hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    
                    <span className="text-base font-semibold capitalize">{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="py-6">
                <div className="flex items-center justify-between rounded-lg bg-[#1A2221] px-4 py-3">
                  <span className="text-sm text-gray-400">0x1234Hksko...5678</span>
                  <button className="p-2 btn-glass-effect rounded-full">
                    <LogOut
                      className="aspect-square w-auto h-14 p-3"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
