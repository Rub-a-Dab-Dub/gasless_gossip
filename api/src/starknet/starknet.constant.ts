export const CONTRACTS = [
  {
    "type": "impl",
    "name": "GaslessGossipPaymentsImpl",
    "interface_name": "gg_pay::interface::IGGPay"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "gg_pay::interface::IGGPay",
    "items": [
      {
        "type": "function",
        "name": "tip_user",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "context",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "pay_room_entry",
        "inputs": [
          {
            "name": "room_id",
            "type": "core::integer::u256"
          },
          {
            "name": "room_creator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "entry_fee",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "send_tokens",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "withdraw_fees",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_platform_fee",
        "inputs": [
          {
            "name": "fee_bps",
            "type": "core::integer::u16"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_paused",
        "inputs": [
          {
            "name": "paused",
            "type": "core::bool"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_platform_fee",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u16"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_accumulated_fees",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_paused",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_user_balance",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_balance",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "create_user",
        "inputs": [
          {
            "name": "username",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_username",
        "inputs": [
          {
            "name": "old_username",
            "type": "core::felt252"
          },
          {
            "name": "new_username",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_user_onchain_address",
        "inputs": [
          {
            "name": "username",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_username_by_wallet",
        "inputs": [
          {
            "name": "wallet",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "withdraw_from_userwallet",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "username",
            "type": "core::felt252"
          },
          {
            "name": "recipient_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "OwnableImpl",
    "interface_name": "openzeppelin_access::ownable::interface::IOwnable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::ownable::interface::IOwnable",
    "items": [
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "strk_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "platform_fee_bps",
        "type": "core::integer::u16"
      },
      {
        "name": "wallet_class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::TipSent",
    "kind": "struct",
    "members": [
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "recipient",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "platform_fee",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "net_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "context",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::RoomEntryPaid",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "room_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "room_creator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "entry_fee",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "platform_fee",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "creator_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::TokensSent",
    "kind": "struct",
    "members": [
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "recipient",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::FeesWithdrawn",
    "kind": "struct",
    "members": [
      {
        "name": "recipient",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::PlatformFeeUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "old_fee_bps",
        "type": "core::integer::u16",
        "kind": "data"
      },
      {
        "name": "new_fee_bps",
        "type": "core::integer::u16",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::ContractPaused",
    "kind": "struct",
    "members": [
      {
        "name": "paused",
        "type": "core::bool",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::UserRegistered",
    "kind": "struct",
    "members": [
      {
        "name": "username",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "wallet_address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::UsernameUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "old_username",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "new_username",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "wallet_address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "gg_pay::gg_pay::GaslessGossipPayments::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "TipSent",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::TipSent",
        "kind": "nested"
      },
      {
        "name": "RoomEntryPaid",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::RoomEntryPaid",
        "kind": "nested"
      },
      {
        "name": "TokensSent",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::TokensSent",
        "kind": "nested"
      },
      {
        "name": "FeesWithdrawn",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::FeesWithdrawn",
        "kind": "nested"
      },
      {
        "name": "PlatformFeeUpdated",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::PlatformFeeUpdated",
        "kind": "nested"
      },
      {
        "name": "ContractPaused",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::ContractPaused",
        "kind": "nested"
      },
      {
        "name": "UserRegistered",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::UserRegistered",
        "kind": "nested"
      },
      {
        "name": "UsernameUpdated",
        "type": "gg_pay::gg_pay::GaslessGossipPayments::UsernameUpdated",
        "kind": "nested"
      },
      {
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat"
      }
    ]
  }
];
export const CONTRACT_TOKEN = '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';