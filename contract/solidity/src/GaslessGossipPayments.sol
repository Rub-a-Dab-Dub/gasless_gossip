// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GaslessGossipPayments
 * @notice A minimal, gas-efficient payment contract for the GaslessGossip social app
 * @dev Enables tipping, room entry payments, and free P2P transfers with a 2% platform fee
 */
contract GaslessGossipPayments is Ownable, Pausable, ReentrancyGuard {
    // ==================== STATE VARIABLES ====================

    /// @notice The ERC20 token used for payments
    IERC20 public immutable paymentToken;

    /// @notice Platform fee in basis points (200 = 2%)
    uint16 public platformFeeBps;

    /// @notice Accumulated platform fees available for withdrawal
    uint256 public accumulatedFees;

    /// @notice Maximum fee allowed (1000 = 10%)
    uint16 public constant MAX_FEE_BPS = 1000;

    /// @notice Basis points denominator (10000 = 100%)
    uint16 public constant BPS_DENOMINATOR = 10000;

    // ==================== EVENTS ====================

    /**
     * @notice Emitted when a user tips another user
     * @param sender Address of the tipper
     * @param recipient Address of the recipient
     * @param amount Total amount sent
     * @param platformFee Platform fee deducted
     * @param netAmount Amount received by recipient
     * @param context Context of the tip (e.g., 'chat_tip', 'room_tip')
     * @param timestamp Block timestamp
     */
    event TipSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 platformFee,
        uint256 netAmount,
        bytes32 context,
        uint256 timestamp
    );

    /**
     * @notice Emitted when a user pays to enter a room
     * @param user Address of the user entering the room
     * @param roomId ID of the room
     * @param roomCreator Address of the room creator
     * @param entryFee Total entry fee paid
     * @param platformFee Platform fee deducted
     * @param creatorAmount Amount sent to room creator
     * @param timestamp Block timestamp
     */
    event RoomEntryPaid(
        address indexed user,
        uint256 indexed roomId,
        address indexed roomCreator,
        uint256 entryFee,
        uint256 platformFee,
        uint256 creatorAmount,
        uint256 timestamp
    );

    /**
     * @notice Emitted when tokens are sent P2P (no fees)
     * @param sender Address of the sender
     * @param recipient Address of the recipient
     * @param amount Amount transferred
     * @param timestamp Block timestamp
     */
    event TokensSent(address indexed sender, address indexed recipient, uint256 amount, uint256 timestamp);

    /**
     * @notice Emitted when platform fees are withdrawn
     * @param recipient Address receiving the fees
     * @param amount Amount withdrawn
     * @param timestamp Block timestamp
     */
    event FeesWithdrawn(address indexed recipient, uint256 amount, uint256 timestamp);

    /**
     * @notice Emitted when platform fee is updated
     * @param oldFeeBps Previous fee in basis points
     * @param newFeeBps New fee in basis points
     * @param timestamp Block timestamp
     */
    event PlatformFeeUpdated(uint16 oldFeeBps, uint16 newFeeBps, uint256 timestamp);

    // ==================== ERRORS ====================

    error ZeroAddress();
    error SelfTip();
    error SelfSend();
    error ZeroAmount();
    error InvalidFee();
    error InsufficientFees();
    error TransferFailed();

    // ==================== CONSTRUCTOR ====================

    /**
     * @notice Initializes the contract
     * @param _admin Address of the contract admin
     * @param _paymentToken Address of the ERC20 token for payments
     * @param _platformFeeBps Platform fee in basis points (200 = 2%)
     */
    constructor(address _admin, address _paymentToken, uint16 _platformFeeBps) Ownable(_admin) {
        if (_admin == address(0)) revert ZeroAddress();
        if (_paymentToken == address(0)) revert ZeroAddress();
        if (_platformFeeBps > MAX_FEE_BPS) revert InvalidFee();

        paymentToken = IERC20(_paymentToken);
        platformFeeBps = _platformFeeBps;
    }

    // ==================== EXTERNAL FUNCTIONS ====================

    /**
     * @notice Tip another user (platform takes 2% fee)
     * @param recipient Address of the tip recipient
     * @param amount Amount to tip (total including fee)
     * @param context Context identifier for the tip
     * @dev Requires prior token approval
     */
    function tipUser(address recipient, uint256 amount, bytes32 context) external whenNotPaused nonReentrant {
        if (recipient == address(0)) revert ZeroAddress();
        if (msg.sender == recipient) revert SelfTip();
        if (amount == 0) revert ZeroAmount();

        // Calculate platform fee and net amount
        uint256 platformFee = (amount * platformFeeBps) / BPS_DENOMINATOR;
        uint256 netAmount = amount - platformFee;

        // Update accumulated fees
        accumulatedFees += platformFee;

        // Transfer tokens from sender to contract
        bool success = paymentToken.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();

        // Transfer net amount to recipient
        success = paymentToken.transfer(recipient, netAmount);
        if (!success) revert TransferFailed();

        emit TipSent(msg.sender, recipient, amount, platformFee, netAmount, context, block.timestamp);
    }

    /**
     * @notice Pay to enter a room (platform takes 2%, creator gets 98%)
     * @param roomId ID of the room to enter
     * @param roomCreator Address of the room creator
     * @param entryFee Entry fee for the room
     * @dev Requires prior token approval
     */
    function payRoomEntry(uint256 roomId, address roomCreator, uint256 entryFee) external whenNotPaused nonReentrant {
        if (roomCreator == address(0)) revert ZeroAddress();
        if (entryFee == 0) revert ZeroAmount();

        // Calculate platform fee and creator amount
        uint256 platformFee = (entryFee * platformFeeBps) / BPS_DENOMINATOR;
        uint256 creatorAmount = entryFee - platformFee;

        // Update accumulated fees
        accumulatedFees += platformFee;

        // Transfer tokens from user to contract
        bool success = paymentToken.transferFrom(msg.sender, address(this), entryFee);
        if (!success) revert TransferFailed();

        // Transfer creator amount to room creator
        success = paymentToken.transfer(roomCreator, creatorAmount);
        if (!success) revert TransferFailed();

        emit RoomEntryPaid(msg.sender, roomId, roomCreator, entryFee, platformFee, creatorAmount, block.timestamp);
    }

    /**
     * @notice Direct P2P transfer (NO fees)
     * @param recipient Address of the recipient
     * @param amount Amount to transfer
     * @dev Requires prior token approval
     */
    function sendTokens(address recipient, uint256 amount) external whenNotPaused nonReentrant {
        if (recipient == address(0)) revert ZeroAddress();
        if (msg.sender == recipient) revert SelfSend();
        if (amount == 0) revert ZeroAmount();

        // Direct transfer - NO FEES
        bool success = paymentToken.transferFrom(msg.sender, recipient, amount);
        if (!success) revert TransferFailed();

        emit TokensSent(msg.sender, recipient, amount, block.timestamp);
    }

    /**
     * @notice Withdraw platform fees to any address (admin only)
     * @param amount Amount of fees to withdraw
     * @param recipient Address to receive the fees
     */
    function withdrawFees(uint256 amount, address recipient) external onlyOwner {
        if (amount == 0) revert ZeroAmount();
        if (recipient == address(0)) revert ZeroAddress();
        if (amount > accumulatedFees) revert InsufficientFees();

        // Update accumulated fees
        accumulatedFees -= amount;

        // Transfer to recipient
        bool success = paymentToken.transfer(recipient, amount);
        if (!success) revert TransferFailed();

        emit FeesWithdrawn(recipient, amount, block.timestamp);
    }

    /**
     * @notice Update platform fee (admin only)
     * @param feeBps New fee in basis points (max 1000 = 10%)
     */
    function setPlatformFee(uint16 feeBps) external onlyOwner {
        if (feeBps > MAX_FEE_BPS) revert InvalidFee();

        uint16 oldFee = platformFeeBps;
        platformFeeBps = feeBps;

        emit PlatformFeeUpdated(oldFee, feeBps, block.timestamp);
    }

    /**
     * @notice Pause contract (admin only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract (admin only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get platform fee in basis points
     * @return Current platform fee
     */
    function getPlatformFee() external view returns (uint16) {
        return platformFeeBps;
    }

    /**
     * @notice Get accumulated platform fees
     * @return Current accumulated fees
     */
    function getAccumulatedFees() external view returns (uint256) {
        return accumulatedFees;
    }

    /**
     * @notice Check if contract is paused
     * @return Paused status
     */
    function isPaused() external view returns (bool) {
        return paused();
    }

    /**
     * @notice Get token balance of any user
     * @param user Address to check
     * @return Token balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return paymentToken.balanceOf(user);
    }

    /**
     * @notice Get token balance of caller
     * @return Token balance
     */
    function getBalance() external view returns (uint256) {
        return paymentToken.balanceOf(msg.sender);
    }

    /**
     * @notice Calculate fee for a given amount
     * @param amount Amount to calculate fee for
     * @return platformFee Fee amount
     * @return netAmount Amount after fee
     */
    function calculateFee(uint256 amount) external view returns (uint256 platformFee, uint256 netAmount) {
        platformFee = (amount * platformFeeBps) / BPS_DENOMINATOR;
        netAmount = amount - platformFee;
    }
}
