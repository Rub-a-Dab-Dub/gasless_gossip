'use client'

import { Download, ArrowUpFromLine, Repeat } from 'lucide-react'
import {ReceivedIcon, SwapIcon} from "@/components/icons";

interface Transaction {
  id: string
  type: 'received' | 'sent' | 'swap'
  amount: number
  hash: string
  status: 'successful' | 'pending' | 'failed'
  timestamp: string
}

interface TransactionHistoryProps {
  transactions?: Transaction[]
}

export default function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <Download size={20} className="text-[#279DD4]" />
      case 'sent':
        return <ReceivedIcon />
      case 'swap':
        return <SwapIcon />
      default:
        return <Download size={20} className="text-[#279DD4]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-custom-green'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 rounded-tl-3xl rounded-tr-3xl bg-[#192625] border-b border-gray-800">
        <div className="text-light-teal text-sm font-medium">Activity</div>
        <div className="text-light-teal text-sm font-medium">Transaction hash</div>
        <div className="text-light-teal text-sm font-medium">Status</div>
        <div className="text-light-teal text-sm font-medium text-right">Timestamp</div>
      </div>

      {/* Transaction Rows */}
      <div className="bg-[#0a0f1a]">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-800/50 hover:bg-[#0f1621] transition-colors"
          >
            {/* Activity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#151B1A] flex items-center justify-center">
                {getIcon(transaction.type)}
              </div>
              <span className="text-white font-medium">
                {transaction.type === 'received' ? 'Received' : transaction.type === 'sent' ? 'Sent' : 'Swap'} ${transaction.amount}
              </span>
            </div>

            {/* Transaction Hash */}
            <div className="flex items-center">
              <span className="text-dark-grey">Transaction hash</span>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <span className={`font-medium capitalize ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-end">
              <span className="text-light-grey">{transaction.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
