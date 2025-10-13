'use client'

import {
  ArrowLeft,
  Download,
  ChevronDown,
  ArrowUpFromLine
} from 'lucide-react'
import { CopyIcon, ArrowRight } from "@/components/icons";
import { useRouter } from 'next/navigation';

import TransactionHistory from "@/components/TransactionHistory";
import Header from "@/components/ui/Header";

const TRANSACTIONS = [
  {
    id: '1',
    type: 'received' as const,
    amount: 3000,
    hash: '0x1234...5678',
    status: 'successful' as const,
    timestamp: '12/10/2025'
  },
  {
    id: '2',
    type: 'sent' as const,
    amount: 3000,
    hash: '0x1234...5678',
    status: 'successful' as const,
    timestamp: '12/10/2025'
  },
  {
    id: '3',
    type: 'sent' as const,
    amount: 3000,
    hash: '0x1234...5678',
    status: 'successful' as const,
    timestamp: '12/10/2025'
  },
  {
    id: '4',
    type: 'swap' as const,
    amount: 3000,
    hash: '0x1234...5678',
    status: 'successful' as const,
    timestamp: '12/10/2025'
  },
  {
    id: '5',
    type: 'received' as const,
    amount: 3000,
    hash: '0x1234...5678',
    status: 'successful' as const,
    timestamp: '12/10/2025'
  }
]

export default function WalletPage() {
  const router = useRouter()

  return (
    <>
      <Header />
      <div className="pt-18 bg-[#0a0f1a] text-white">
        <section className="max-w-4xl mx-auto px-6 py-8">
          <div className="py-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24}/>
            </button>
            <h1 className="text-lg font-medium">my wallet</h1>
          </div>
          {/* Balance Section */}
          <div className="mb-12">
            <div
              className="flex md:flex-row flex-col justify-center md:justify-between glass-effect__light p-4 rounded-tr-3xl rounded-tl-3xl rounded-bl-md rounded-br-md">
              <div className="flex items-start justify-between">
                <div className="flex md:block md:flex-row flex-col items-center">
                  <p className="text-sm text-teal-300 uppercase tracking-wider mb-4">YOUR BALANCE</p>
                  <h2 className="text-6xl font-fredoka text-dark-white font-bold mb-2">$0</h2>
                  <p className="text-gray-500">≈ $ 3,784.54</p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                {/* Currency Selector */}
                <button
                  className="flex self-center mt-3 sm:ml-auto mb-6 w-fit items-center justify-center gap-2 bg-[#0F5951] px-4 py-2 rounded-full hover:bg-[#14F1D9]/20 transition-colors">
                  <div className="w-6 h-6 bg-[#14F1D9] rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">T</span>
                  </div>
                  <span className="font-semibold">USDT</span>
                  <ChevronDown size={18}/>
                </button>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center space-y-1.5">
                    <button
                      className="flex flex-col items-center gap-2 px-8 py-3 wallet-glass-effect__light rounded-2xl hover:bg-[#252f2e] transition-colors">
                      <Download size={20}/>
                    </button>
                    <span className="text-sm text-dark-white">Receive</span>
                  </div>
                  <div className="text-center space-y-1.5">
                    <button
                      className="flex flex-col items-center gap-2 px-8 py-3 wallet-glass-effect__light rounded-2xl hover:bg-[#252f2e] transition-colors">
                      <CopyIcon />
                    </button>
                    <span className="text-sm text-dark-white">Swap</span>
                  </div>
                  <div className="text-center space-y-1.5">
                    <button
                      className="flex flex-col items-center gap-2 px-8 py-3 wallet-glass-effect__teal rounded-2xl hover:bg-[#14F1D9]/20 transition-colors">
                      <ArrowUpFromLine size={20} className="text-[#14F1D9]"/>
                    </button>
                    <span className="text-sm text-dark-white text-[#14F1D9]">Send</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              {/* Domain Name */}
              <div className="text-center px-4 py-3 mt-3 rounded-bl-2xl rounded-br-2xl glass-effect__light">
                <p className="text-sm text-light-grey tracking-wider mb-2">domain name</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-dark-white font-semibold">username.gaslessgossip.baseeth</span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <CopyIcon />
                  </button>
                </div>
              </div>

              {/* Account Address */}
              <div className="text-center px-4 py-3 mt-3 rounded-bl-2xl rounded-br-2xl glass-effect__light">
                <p className="text-sm text-light-grey tracking-wider mb-2">account address</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-dark-white font-semibold">0xWl32...W893</span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <CopyIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History Section */}
          <div>
            <h3 className="text-base text-light-grey mb-4 pb-2 border-b border-[#131919]">Transaction History</h3>

            {/* Empty State for (No transaction has been made yet) */}
            {/*<div className="rounded-2xl border border-dark-teal-bolor-color py-24">*/}
            {/*  <div className="flex flex-col items-center justify-center text-center">*/}
            {/*    <h4 className="text-xl text-dark-white font-semibold font-fredoka mb-2">No transaction has been made yet</h4>*/}
            {/*    <p className="text-light-grey mb-8">Receive tokens to get started</p>*/}
            {/*    <button*/}
            {/*      className="flex items-center gap-2 px-8 py-3 wallet-glass-effect__teal text-[#14F1D9] rounded-full hover:bg-[#14F1D9]/10 transition-colors">*/}
            {/*      <span className="font-semibold">Receive Tokens</span>*/}
            {/*      <ArrowRight />*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <TransactionHistory transactions={TRANSACTIONS}/>
          </div>
        </section>
      </div>
    </>
  )
}
