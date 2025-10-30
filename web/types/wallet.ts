export interface IWallet {
  id: string;
  starknet_address?: string | null;
  starknet_balance?: string | null;
  base_address?: string | null;
  base_balance?: string | null;
  celo_address?: string | null;
  celo_balance?: string | null;
  created_at: string;
}
