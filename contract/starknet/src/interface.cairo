use starknet::ContractAddress;

#[starknet::interface]
pub trait IGGPay<TContractState> {
    // Tip another user (platform takes 2% fee)
    fn tip_user(
        ref self: TContractState, recipient: ContractAddress, amount: u256, context: felt252,
    );

    // Pay to enter a room (platform takes 2%, creator gets 98%)
    fn pay_room_entry(
        ref self: TContractState, room_id: u256, room_creator: ContractAddress, entry_fee: u256,
    );

    // Direct P2P transfer (NO fees)
    fn send_tokens(ref self: TContractState, recipient: ContractAddress, amount: u256);

    // Admin: Withdraw platform fees to any address
    fn withdraw_fees(ref self: TContractState, amount: u256, recipient: ContractAddress);

    // Admin: Update platform fee (basis points, max 1000 = 10%)
    fn set_platform_fee(ref self: TContractState, fee_bps: u16);

    // Admin: Pause/unpause contract
    fn set_paused(ref self: TContractState, paused: bool);

    // View: Get platform fee in basis points
    fn get_platform_fee(self: @TContractState) -> u16;

    // View: Get accumulated platform fees
    fn get_accumulated_fees(self: @TContractState) -> u256;

    // View: Check if contract is paused
    fn is_paused(self: @TContractState) -> bool;

    // View: Get STRK balance of any user
    fn get_user_balance(self: @TContractState, user: ContractAddress) -> u256;

    // View: Get STRK balance of caller
    fn get_balance(self: @TContractState) -> u256;
}
