// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GaslessGossipPayments.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // 1M USDC (6 decimals)
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract GaslessGossipPaymentsTest is Test {
    GaslessGossipPayments public payments;
    MockUSDC public usdc;

    address public admin = address(1);
    address public alice = address(2);
    address public bob = address(3);
    address public charlie = address(4);

    uint16 constant PLATFORM_FEE_BPS = 200; // 2%
    uint256 constant INITIAL_BALANCE = 1000 * 10 ** 6; // 1000 USDC

    // Redeclare events for testing
    event TipSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 platformFee,
        uint256 netAmount,
        bytes32 context,
        uint256 timestamp
    );

    function setUp() public {
        // Deploy mock USDC
        usdc = new MockUSDC();

        // Deploy payments contract
        vm.prank(admin);
        payments = new GaslessGossipPayments(admin, address(usdc), PLATFORM_FEE_BPS);

        // Setup user balances
        usdc.mint(alice, INITIAL_BALANCE);
        usdc.mint(bob, INITIAL_BALANCE);
        usdc.mint(charlie, INITIAL_BALANCE);
    }

    // ==================== CONSTRUCTOR TESTS ====================

    function test_Constructor() public {
        assertEq(address(payments.paymentToken()), address(usdc));
        assertEq(payments.platformFeeBps(), PLATFORM_FEE_BPS);
        assertEq(payments.owner(), admin);
        assertFalse(payments.isPaused());
    }

    function test_RevertConstructorZeroAdmin() public {
        vm.expectRevert(abi.encodeWithSignature("OwnableInvalidOwner(address)", address(0)));
        new GaslessGossipPayments(address(0), address(usdc), PLATFORM_FEE_BPS);
    }

    function test_RevertConstructorZeroToken() public {
        vm.expectRevert(GaslessGossipPayments.ZeroAddress.selector);
        new GaslessGossipPayments(admin, address(0), PLATFORM_FEE_BPS);
    }

    function test_RevertConstructorInvalidFee() public {
        vm.expectRevert(GaslessGossipPayments.InvalidFee.selector);
        new GaslessGossipPayments(admin, address(usdc), 1001); // > 10%
    }

    // ==================== TIP USER TESTS ====================

    function test_TipUser() public {
        uint256 tipAmount = 100 * 10 ** 6; // 100 USDC

        // Alice approves and tips Bob
        vm.startPrank(alice);
        usdc.approve(address(payments), tipAmount);
        payments.tipUser(bob, tipAmount, bytes32("chat_tip"));
        vm.stopPrank();

        // Check balances
        uint256 expectedFee = (tipAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 expectedNetAmount = tipAmount - expectedFee;

        assertEq(usdc.balanceOf(bob), INITIAL_BALANCE + expectedNetAmount);
        assertEq(payments.accumulatedFees(), expectedFee);
    }

    function test_RevertTipUserZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.ZeroAddress.selector);
        payments.tipUser(address(0), 100, bytes32("test"));
    }

    function test_RevertTipUserSelf() public {
        vm.prank(alice);
        usdc.approve(address(payments), 100);
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.SelfTip.selector);
        payments.tipUser(alice, 100, bytes32("test"));
    }

    function test_RevertTipUserZeroAmount() public {
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.ZeroAmount.selector);
        payments.tipUser(bob, 0, bytes32("test"));
    }

    function test_RevertTipUserWhenPaused() public {
        vm.prank(admin);
        payments.pause();

        vm.prank(alice);
        usdc.approve(address(payments), 100);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSignature("EnforcedPause()"));
        payments.tipUser(bob, 100, bytes32("test"));
    }

    // ==================== ROOM ENTRY TESTS ====================

    function test_PayRoomEntry() public {
        uint256 entryFee = 50 * 10 ** 6; // 50 USDC
        uint256 roomId = 1;

        // Charlie pays to enter Alice's room
        vm.startPrank(charlie);
        usdc.approve(address(payments), entryFee);
        payments.payRoomEntry(roomId, alice, entryFee);
        vm.stopPrank();

        // Check balances
        uint256 expectedFee = (entryFee * PLATFORM_FEE_BPS) / 10000;
        uint256 expectedCreatorAmount = entryFee - expectedFee;

        assertEq(usdc.balanceOf(alice), INITIAL_BALANCE + expectedCreatorAmount);
        assertEq(payments.accumulatedFees(), expectedFee);
    }

    function test_RevertPayRoomEntryZeroCreator() public {
        vm.prank(charlie);
        vm.expectRevert(GaslessGossipPayments.ZeroAddress.selector);
        payments.payRoomEntry(1, address(0), 100);
    }

    function test_RevertPayRoomEntryZeroAmount() public {
        vm.prank(charlie);
        vm.expectRevert(GaslessGossipPayments.ZeroAmount.selector);
        payments.payRoomEntry(1, alice, 0);
    }

    // ==================== SEND TOKENS (P2P) TESTS ====================

    function test_SendTokens() public {
        uint256 amount = 200 * 10 ** 6; // 200 USDC

        uint256 bobBalanceBefore = usdc.balanceOf(bob);

        // Alice sends to Bob (no fees)
        vm.startPrank(alice);
        usdc.approve(address(payments), amount);
        payments.sendTokens(bob, amount);
        vm.stopPrank();

        // Check balances - Bob should receive full amount
        assertEq(usdc.balanceOf(bob), bobBalanceBefore + amount);
        assertEq(payments.accumulatedFees(), 0); // No fees on P2P
    }

    function test_RevertSendTokensZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.ZeroAddress.selector);
        payments.sendTokens(address(0), 100);
    }

    function test_RevertSendTokensSelf() public {
        vm.prank(alice);
        usdc.approve(address(payments), 100);
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.SelfSend.selector);
        payments.sendTokens(alice, 100);
    }

    function test_RevertSendTokensZeroAmount() public {
        vm.prank(alice);
        vm.expectRevert(GaslessGossipPayments.ZeroAmount.selector);
        payments.sendTokens(bob, 0);
    }

    // ==================== ADMIN FUNCTIONS TESTS ====================

    function test_WithdrawFees() public {
        // Generate fees
        uint256 tipAmount = 100 * 10 ** 6;
        vm.startPrank(alice);
        usdc.approve(address(payments), tipAmount);
        payments.tipUser(bob, tipAmount, bytes32("test"));
        vm.stopPrank();

        uint256 fees = payments.accumulatedFees();
        address recipient = address(999);

        // Admin withdraws fees
        vm.prank(admin);
        payments.withdrawFees(fees, recipient);

        assertEq(payments.accumulatedFees(), 0);
        assertEq(usdc.balanceOf(recipient), fees);
    }

    function test_RevertWithdrawFeesNotOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        payments.withdrawFees(100, alice);
    }

    function test_RevertWithdrawFeesInsufficientFees() public {
        vm.prank(admin);
        vm.expectRevert(GaslessGossipPayments.InsufficientFees.selector);
        payments.withdrawFees(1000, admin);
    }

    function test_SetPlatformFee() public {
        uint16 newFee = 300; // 3%

        vm.prank(admin);
        payments.setPlatformFee(newFee);

        assertEq(payments.platformFeeBps(), newFee);
    }

    function test_RevertSetPlatformFeeNotOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        payments.setPlatformFee(300);
    }

    function test_RevertSetPlatformFeeInvalidFee() public {
        vm.prank(admin);
        vm.expectRevert(GaslessGossipPayments.InvalidFee.selector);
        payments.setPlatformFee(1001); // > 10%
    }

    function test_PauseUnpause() public {
        vm.startPrank(admin);

        payments.pause();
        assertTrue(payments.isPaused());

        payments.unpause();
        assertFalse(payments.isPaused());

        vm.stopPrank();
    }

    function test_RevertPauseNotOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        payments.pause();
    }

    // ==================== VIEW FUNCTIONS TESTS ====================

    function test_GetUserBalance() public {
        uint256 balance = payments.getUserBalance(alice);
        assertEq(balance, INITIAL_BALANCE);
    }

    function test_GetBalance() public {
        vm.prank(alice);
        uint256 balance = payments.getBalance();
        assertEq(balance, INITIAL_BALANCE);
    }

    function test_CalculateFee() public {
        uint256 amount = 100 * 10 ** 6;
        (uint256 fee, uint256 net) = payments.calculateFee(amount);

        uint256 expectedFee = (amount * PLATFORM_FEE_BPS) / 10000;
        uint256 expectedNet = amount - expectedFee;

        assertEq(fee, expectedFee);
        assertEq(net, expectedNet);
    }

    // ==================== INTEGRATION TESTS ====================

    function test_CompleteUserFlow() public {
        // Alice tips Bob
        uint256 tipAmount = 100 * 10 ** 6;
        vm.startPrank(alice);
        usdc.approve(address(payments), tipAmount);
        payments.tipUser(bob, tipAmount, bytes32("chat_tip"));
        vm.stopPrank();

        // Bob pays room entry to Alice
        uint256 entryFee = 50 * 10 ** 6;
        vm.startPrank(bob);
        usdc.approve(address(payments), entryFee);
        payments.payRoomEntry(1, alice, entryFee);
        vm.stopPrank();

        // Alice sends P2P to Charlie
        uint256 p2pAmount = 30 * 10 ** 6;
        vm.startPrank(alice);
        usdc.approve(address(payments), p2pAmount);
        payments.sendTokens(charlie, p2pAmount);
        vm.stopPrank();

        // Verify total fees (only from tip and room entry)
        uint256 expectedTotalFees = (tipAmount * PLATFORM_FEE_BPS) / 10000 + (entryFee * PLATFORM_FEE_BPS) / 10000;

        assertEq(payments.accumulatedFees(), expectedTotalFees);
    }

    function test_MultipleUsersTippingSameRecipient() public {
        uint256 tipAmount = 50 * 10 ** 6;

        // Alice tips Bob
        vm.startPrank(alice);
        usdc.approve(address(payments), tipAmount);
        payments.tipUser(bob, tipAmount, bytes32("tip1"));
        vm.stopPrank();

        // Charlie tips Bob
        vm.startPrank(charlie);
        usdc.approve(address(payments), tipAmount);
        payments.tipUser(bob, tipAmount, bytes32("tip2"));
        vm.stopPrank();

        uint256 expectedFeePerTip = (tipAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 expectedNetPerTip = tipAmount - expectedFeePerTip;
        uint256 expectedBobBalance = INITIAL_BALANCE + (expectedNetPerTip * 2);

        assertEq(usdc.balanceOf(bob), expectedBobBalance);
        assertEq(payments.accumulatedFees(), expectedFeePerTip * 2);
    }

    // ==================== FUZZ TESTS ====================

    function testFuzz_TipUser(uint256 amount) public {
        // Bound amount to reasonable range
        amount = bound(amount, 1, INITIAL_BALANCE);

        vm.startPrank(alice);
        usdc.approve(address(payments), amount);
        payments.tipUser(bob, amount, bytes32("fuzz"));
        vm.stopPrank();

        uint256 expectedFee = (amount * PLATFORM_FEE_BPS) / 10000;
        assertEq(payments.accumulatedFees(), expectedFee);
    }

    function testFuzz_SendTokens(uint256 amount) public {
        amount = bound(amount, 1, INITIAL_BALANCE);

        uint256 bobBalanceBefore = usdc.balanceOf(bob);

        vm.startPrank(alice);
        usdc.approve(address(payments), amount);
        payments.sendTokens(bob, amount);
        vm.stopPrank();

        assertEq(usdc.balanceOf(bob), bobBalanceBefore + amount);
        assertEq(payments.accumulatedFees(), 0); // No fees on P2P
    }

    // ==================== EVENT TESTS ====================

    function test_TipUserEmitsEvent() public {
        uint256 amount = 100 * 10 ** 6;
        uint256 expectedFee = (amount * PLATFORM_FEE_BPS) / 10000;
        uint256 expectedNet = amount - expectedFee;

        vm.startPrank(alice);
        usdc.approve(address(payments), amount);

        vm.expectEmit(true, true, false, true);
        emit TipSent(alice, bob, amount, expectedFee, expectedNet, bytes32("test"), block.timestamp);

        payments.tipUser(bob, amount, bytes32("test"));
        vm.stopPrank();
    }
}
