import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'wallet_viewmodel.dart';

class WalletView extends StackedView<WalletViewModel> {
  const WalletView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    WalletViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                _buildTopBar(viewModel),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        const SizedBox(height: 24),
                        _buildWalletDetails(viewModel),
                        const SizedBox(height: 32),
                        _buildTransactionHistory(viewModel),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ✅ Overlays sit outside SafeArea now
          if (viewModel.showReceiveBottomSheet)
            _buildReceiveBottomSheetWithOverlay(viewModel),

          if (viewModel.showCopySuccess) _buildCopySuccessMessage(),
        ],
      ),
    );
  }

  Widget _buildTopBar(WalletViewModel viewmodel) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Transform(
            alignment: Alignment.center,
            transform: Matrix4.rotationY(3.14159),
            child: GestureDetector(
              onTap: () {
                viewmodel.onBackTap();
              },
              child: const Icon(
                Icons.arrow_forward,
                color: Color(0xFFF1F7F6),
                size: 24,
              ),
            ),
          ),
          Expanded(
            child: Text(
              'my wallet',
              textAlign: TextAlign.center,
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFD6D8D3),
                height: 1.14,
              ),
            ),
          ),
          const Opacity(
            opacity: 0,
            child: Icon(
              Icons.arrow_forward,
              size: 24,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWalletDetails(WalletViewModel viewModel) {
    return Column(
      children: [
        // About User Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
              bottomLeft: Radius.circular(4),
              bottomRight: Radius.circular(4),
            ),
            boxShadow: [
              BoxShadow(
                  color: const Color(0xFF14F1D9).withOpacity(0.04),
                  blurRadius: 24,
                  offset: const Offset(0, 0),
                  inset: true),
            ],
          ),
          child: Column(
            children: [
              // Balance Section
              Column(
                children: [
                  Text(
                    'YOUR BALANCE',
                    style: GoogleFonts.baloo2(
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF0E9186),
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '\$3,784.545',
                    style: GoogleFonts.fredoka(
                      fontSize: 32,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFF1F7F6),
                      height: 1.22,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.drag_handle,
                        size: 12,
                        color: Color(0xFF6B7A77),
                      ),
                      const SizedBox(width: 2),
                      Text(
                        '\$3,784.54',
                        style: GoogleFonts.baloo2(
                          fontSize: 10,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF6B7A77),
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Token Selector
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF171C1B),
                  border: Border.all(color: const Color(0xFF212424)),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFF26A17B),
                        ),
                        child: Image.asset(AppAssets.base)),
                    const SizedBox(width: 4),
                    Text(
                      'BASE ETH',
                      style: GoogleFonts.baloo2(
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                        height: 1.33,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(
                      Icons.keyboard_arrow_down,
                      size: 20,
                      color: Color(0xFFA3A9A6),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      svgPath: AppAssets.receive,
                      label: 'Receive',
                      isHighlighted: false,
                      onTap: () => viewModel.onReceiveTapped(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      svgPath: AppAssets.swap,
                      label: 'Swap',
                      isHighlighted: false,
                      onTap: () => viewModel.onSwapTapped(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      svgPath: AppAssets.receive,
                      label: 'send',
                      isHighlighted: true,
                      onTap: () => viewModel.onSendTapped(),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 5),

        // Wallet Address Section
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
            ),
            boxShadow: [
              BoxShadow(
                  color: const Color(0xFF14F1D9).withOpacity(0.06),
                  blurRadius: 12,
                  offset: const Offset(0, 0),
                  inset: true),
            ],
          ),
          child: Column(
            children: [
              Text(
                'username.gaslessgossip.baseeth',
                style: GoogleFonts.baloo2(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFF1F7F6),
                  height: 1.14,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '0xWI32....W893',
                    style: GoogleFonts.baloo2(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFA3A9A6),
                      height: 1.33,
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => viewModel.onCopyAddress(),
                    child: const Icon(
                      Icons.copy,
                      size: 12,
                      color: Color(0xFFA3A9A6),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required String svgPath,
    required String label,
    required bool isHighlighted,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 100,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF121418),
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: isHighlighted
                      ? const Color(0xFF0F5951)
                      : const Color(0xFF4D5957).withOpacity(0.8),
                  blurRadius: 12,
                  offset: const Offset(0, 1),
                  spreadRadius: 0,
                  blurStyle: BlurStyle.inner,
                  inset: true,
                ),
              ],
            ),
            child: Center(
              child: SvgPicture.asset(
                svgPath,
                fit: BoxFit.none,
                colorFilter: ColorFilter.mode(
                  isHighlighted
                      ? const Color(0xFF14F1D9)
                      : const Color(0xFFF1F7F6),
                  BlendMode.srcIn,
                ),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.baloo2(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: isHighlighted
                  ? const Color(0xFF14F1D9)
                  : const Color(0xFFF1F7F6),
              height: 1.58,
              letterSpacing: -0.24,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionHistory(WalletViewModel viewModel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Container(
          padding: const EdgeInsets.symmetric(vertical: 4),
          decoration: const BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: Color(0xFF131919),
                width: 1,
              ),
            ),
          ),
          child: Text(
            'Transaction History',
            style: GoogleFonts.baloo2(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFA3A9A6),
              height: 1.75,
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Transaction List or Empty State
        viewModel.hasTransactions
            ? Column(
                children: viewModel.transactions
                    .map((transaction) => _buildTransactionItem(transaction))
                    .toList(),
              )
            : _buildEmptyState(viewModel),
      ],
    );
  }

  Widget _buildEmptyState(WalletViewModel viewModel) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 80),
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        border: Border.all(color: const Color(0xFF181E1D)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'No transaction has been made yet',
            style: GoogleFonts.fredoka(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFF1F7F6),
              height: 1.19,
              letterSpacing: -0.32,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Receive tokens to get started',
            style: GoogleFonts.baloo2(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFA3A9A6),
              height: 1.5,
              letterSpacing: -0.24,
            ),
          ),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () => viewModel.onGetStartedFromHistory(),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF121418),
                borderRadius: BorderRadius.circular(32),
                boxShadow: const [
                  BoxShadow(
                      color: Color(0xFF0F5951),
                      blurRadius: 12,
                      offset: Offset(0, 1),
                      spreadRadius: 0,
                      blurStyle: BlurStyle.inner,
                      inset: true),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Receive Tokens',
                    style: GoogleFonts.fredoka(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF14F1D9),
                      height: 1.21,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Icon(
                    Icons.arrow_forward,
                    color: Color(0xFF14F1D9),
                    size: 24,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionItem(Transaction transaction) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFF151B1A),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          // Icons container
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF151B1A),
              borderRadius: BorderRadius.circular(30),
            ),
            child: Center(
              child: transaction.icons.length == 1
                  ? _buildTransactionIcon(transaction.icons.first)
                  : Stack(
                      alignment: Alignment.center,
                      children: [
                        // Show only the primary icon when multiple
                        _buildTransactionIcon(transaction.icons.first),
                      ],
                    ),
            ),
          ),
          const SizedBox(width: 6),

          // Transaction details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction.amount,
                  style: GoogleFonts.fredoka(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFF1F7F6),
                    height: 1.21,
                    letterSpacing: -0.28,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  transaction.hash,
                  style: GoogleFonts.baloo2(
                    fontSize: 10,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF7C837F),
                    height: 1.8,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),

          // Date and status
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                transaction.date,
                style: GoogleFonts.baloo2(
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                  height: 1.8,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                transaction.status,
                style: GoogleFonts.fredoka(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF14E57D),
                  height: 1.25,
                  letterSpacing: -0.24,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionIcon(TransactionType type) {
    String svgAsset;

    switch (type) {
      case TransactionType.receive:
        svgAsset = AppAssets.receive1;
        break;
      case TransactionType.swap:
        svgAsset = AppAssets.swap1;
        break;
      case TransactionType.send:
        svgAsset = AppAssets.sent1;
        break;
    }

    return SvgPicture.asset(
      svgAsset,
      width: 20,
      height: 20,
    );
  }

  Widget _buildReceiveBottomSheetWithOverlay(WalletViewModel viewModel) {
    return Stack(
      children: [
        // Dimmed Background Overlay
        GestureDetector(
          onTap: () => viewModel.hideReceiveBottomSheet(),
          child: Container(
            width: double.infinity,
            height: double.infinity,
            color: Colors.black.withOpacity(0.5), // Dark overlay
          ),
        ),

        // Bottom Sheet
        _buildReceiveBottomSheet(viewModel),
      ],
    );
  }

  Widget _buildReceiveBottomSheet(WalletViewModel viewModel) {
    return NotificationListener<DraggableScrollableNotification>(
      onNotification: (notification) {
        if (notification.extent <= 0.1) {
          // Auto-dismiss when dragged down
          WidgetsBinding.instance.addPostFrameCallback((_) {
            // Bottom sheet will close automatically
          });
        }
        return false;
      },
      child: DraggableScrollableSheet(
        initialChildSize: 0.45,
        minChildSize: 0.0,
        maxChildSize: 0.8,
        snap: true,
        snapSizes: const [0.0, 0.6],
        builder: (context, scrollController) {
          return Container(
            decoration: const BoxDecoration(
              color: Color(0xFF14161A),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              border: Border(
                top: BorderSide(color: Color(0xFF161F1E), width: 1),
              ),
            ),
            child: SingleChildScrollView(
              controller: scrollController,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag Handle
                  Container(
                    width: 48,
                    height: 6,
                    margin: const EdgeInsets.only(top: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2A3533),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Token List
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 40),
                    child: Column(
                      children: [
                        _buildTokenItem(context,
                            viewModel: viewModel,
                            tokenName: 'BASE ETH',
                            address: '0x05318af....326t1h4',
                            username: 'username.gaslessgossip.baseeth',
                            logoPath: AppAssets.base),
                        _buildTokenItem(context,
                            viewModel: viewModel,
                            tokenName: 'USDT',
                            address: '0x05318af....326t1h4',
                            username: 'username.gaslessgossip.usdt',
                            logoPath: AppAssets.usdt),
                        _buildTokenItem(context,
                            viewModel: viewModel,
                            tokenName: 'XLM',
                            address: '0x05318af....326t1h4',
                            username: 'username.gaslessgossip.xlm',
                            logoPath: AppAssets.xlm),
                        _buildTokenItem(context,
                            viewModel: viewModel,
                            tokenName: 'Starknet',
                            address: '0x05318af....326t1h4',
                            username: 'username.gaslessgossip.strk',
                            logoPath: AppAssets.stark),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTokenItem(
    BuildContext context, {
    required WalletViewModel viewModel,
    required String tokenName,
    required String address,
    required String username,
    required String logoPath, // 👈 add this
    bool isNetworkImage = false, // 👈 optional
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFF161F1E),
            width: 1,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Token Info
          Expanded(
            child: Row(
              children: [
                // Token Icon
                Container(
                  width: 24,
                  height: 24,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF26A17B), // optional fallback bg
                  ),
                  child: ClipOval(
                    child: isNetworkImage
                        ? Image.network(
                            logoPath,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(
                                Icons.error,
                                size: 16,
                                color: Colors.white),
                          )
                        : Image.asset(
                            logoPath,
                            fit: BoxFit.cover,
                          ),
                  ),
                ),
                const SizedBox(width: 4),

                // Token Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        tokenName,
                        style: GoogleFonts.baloo2(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFF1F7F6),
                          height: 1.57,
                        ),
                      ),
                      Text(
                        address,
                        style: GoogleFonts.baloo2(
                          fontSize: 10,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFA3A9A6),
                          height: 1.2,
                        ),
                      ),
                      Text(
                        username,
                        style: GoogleFonts.baloo2(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF0E9186),
                          height: 1.17,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Right: Action Buttons
          Row(
            children: [
              // QR Code Button
              GestureDetector(
                onTap: () => viewModel.onQRCodeTapped(),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFF151B1A),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.qr_code,
                      size: 18,
                      color: Color(0xFFA3A9A6),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),

              // Divider
              Container(
                width: 2,
                height: 24,
                decoration: BoxDecoration(
                  color: const Color(0xFF161F1E),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 16),

              // Copy Button
              GestureDetector(
                onTap: () {
                  viewModel.onCopyAddressFromBottomSheet();
                },
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFF151B1A),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.copy,
                      size: 16,
                      color: Color(0xFFA3A9A6),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCopySuccessMessage() {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: AnimatedOpacity(
        opacity: 0.96,
        duration: const Duration(milliseconds: 300),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 15),
          decoration: const BoxDecoration(
            color: Color(0xFF121A19),
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(12),
              bottomRight: Radius.circular(12),
            ),
            boxShadow: [
              BoxShadow(
                color: Color(0x1F14F1D9),
                blurRadius: 5,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: SafeArea(
            bottom: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.check_circle,
                  size: 24,
                  color: Color(0xFF14F1D9),
                ),
                const SizedBox(width: 8),
                Text(
                  'Copy successful',
                  style: GoogleFonts.fredoka(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFF1F7F6),
                    height: 1.21,
                    letterSpacing: -0.28,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  WalletViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      WalletViewModel();
}
