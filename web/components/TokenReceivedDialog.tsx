'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ReceiveAddressDialogProps {
  isOpen: boolean
  onClose: () => void
  domainName?: string
  accountAddress?: string
}

export default function TokenReceivedDialog({
  isOpen,
  onClose,
  domainName = 'username.gaslessgossip.baseeth',
  accountAddress = '0xWI32....W893'
}: ReceiveAddressDialogProps) {

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-100">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl bg-dark-900 rounded-3xl shadow-2xl overflow-hidden border border-[#14F1D9]/30">
          <div className="p-12">
            {/* Header */}
            <section className="p-4 small-glass-effect rounded-4xl">
              <div className="text-center mb-8">
                <p className="text-teal-300 text-sm font-medium mb-3 uppercase tracking-wider">
                  RECEIVE
                </p>
                <h2 className="text-white text-xl font-semibold">
                  BaseEth Address
                </h2>
              </div>

              {/* QR Code Container */}
              <div className="flex justify-center mb-12">
                <div className="bg-white rounded-full relative">
                  {/* Checkered pattern background */}
                  <div className="w-54 h-54 rounded-3xl" style={{
                    backgroundImage: `url(/checker.png)`
                  }}>
                    {/* ETH Logo Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-xl">
                        <svg
                          viewBox="0 0 256 417"
                          className="w-10 h-10 text-white"
                          fill="currentColor"
                        >
                          <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fillOpacity=".6"/>
                          <path d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                          <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fillOpacity=".6"/>
                          <path d="M127.962 416.905v-104.72L0 236.585z"/>
                          <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fillOpacity=".2"/>
                          <path d="M0 212.32l127.96 75.638v-133.8z" fillOpacity=".6"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Address Section */}
            <div className="">
              {/* Domain Name */}
              <div
                className="text-center px-4 py-3 mt-3 rounded-bl-lg rounded-br-lg rounded-tl-3xl rounded-tr-3xl border border-dark-teal small-glass-effect">
                <p className="text-xs text-light-grey tracking-wider mb-2">domain name</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-dark-white">username.gaslessgossip.baseeth</span>
                  <button className="text-light-grey hover:text-white transition-colors">
                    <Copy size={16}/>
                  </button>
                </div>
              </div>

              {/* Account Address */}
              <div
                className="text-center px-4 py-3 mt-3 rounded-tl-lg rounded-tr-lg rounded-bl-2xl rounded-br-2xl border border-dark-teal small-glass-effect">
                <p className="text-xs text-light-grey tracking-wider mb-2">account address</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-dark-white font-semibold">0xWl32...W893</span>
                  <button className="text-light-grey hover:text-white transition-colors">
                    <Copy size={16}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
