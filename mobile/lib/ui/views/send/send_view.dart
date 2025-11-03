import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'send_viewmodel.dart';

class SendView extends StackedView<SendViewModel> {
  const SendView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    SendViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
        backgroundColor: const Color(0xFF121418),
        body: SafeArea(
          child: Column(
            children: [
              _buildTopBar(viewModel),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      const SizedBox(height: 24),
                      _buildTransferHeader(),
                      const SizedBox(height: 32),
                      _buildWalletDetails(viewModel),
                      const SizedBox(height: 32),
                      _buildInputFields(viewModel),
                      const SizedBox(height: 20),
                      _buildGasFee(),
                      const SizedBox(height: 100), // add bottom space
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // 👇 Fixed button stays visible at the bottom
        bottomNavigationBar: Padding(
          padding:
              const EdgeInsets.fromLTRB(16, 0, 16, 8), // ⬅️ raised from bottom
          child: SafeArea(
            // ensures it respects device notches
            minimum: const EdgeInsets.only(bottom: 8),
            child: _buildSendButton(viewModel),
          ),
        ));
  }

  Widget _buildTopBar(SendViewModel viewModel) {
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
                viewModel.onBackTap();
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
              'send',
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

  Widget _buildTransferHeader() {
    return Column(
      children: [
        Text(
          'TRANSFER',
          style: GoogleFonts.baloo2(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF0E9186),
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Base Eth Token',
              style: GoogleFonts.baloo2(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFF1F7F6),
                height: 1.14,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(
              Icons.keyboard_arrow_down,
              size: 20,
              color: Color(0xFFA3A9A6),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildWalletDetails(SendViewModel viewModel) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF14F1D9).withValues(alpha: 0.04),
            blurRadius: 24,
            offset: const Offset(0, 0),
            inset: true,
          ),
        ],
      ),
      child: Row(
        children: [
          // Left side - Market Cap
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mkt Cap:',
                  style: GoogleFonts.baloo2(
                    fontSize: 10,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  '12',
                  style: GoogleFonts.baloo2(
                    fontSize: 20,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFF1F7F6),
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    SvgPicture.asset(
                      AppAssets.convert,
                      color: const Color(0xFF6B7A77),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      '\$ 13.345',
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
          ),
          // Divider
          Container(
            width: 1,
            height: 61,
            color: const Color(0xFF191B1F),
          ),
          // Right side - Balance
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Balance: \$ 3,000',
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                    height: 1.58,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF191B1F),
                    border: Border.all(color: const Color(0xFF202226)),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: Image.asset(AppAssets.base),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Base Eth',
                        style: GoogleFonts.baloo2(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFF1F7F6),
                          height: 1.33,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.keyboard_arrow_down,
                        size: 20,
                        color: Color(0xFFA3A9A6),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputFields(SendViewModel viewModel) {
    return Column(
      children: [
        // Nickname Input Field
        _buildInputField(
          label: 'address/ sns',
          placeholder: 'e.g 0x05318af....326t1h4"',
          controller: viewModel.nicknameController,
        ),
        const SizedBox(height: 32),
        // Amount Input Field
        _buildAmountInputField(
          label: 'amount',
          placeholder: 'e.g 1234',
          controller: viewModel.amountController,
          onMaxTap: () => viewModel.onMaxTap(),
        ),
      ],
    );
  }

  Widget _buildInputField({
    required String label,
    required String placeholder,
    required TextEditingController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF14F1D9),
            height: 1.33,
            letterSpacing: -0.24,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            border: Border.all(color: const Color(0xFF1A2221)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            controller: controller,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFF1F7F6),
              height: 1.43,
              letterSpacing: -0.28,
            ),
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: placeholder,
              hintStyle: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                fontStyle: FontStyle.italic,
                color: const Color(0xFF7C837F),
                height: 1.43,
                letterSpacing: -0.28,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAmountInputField({
    required String label,
    required String placeholder,
    required TextEditingController controller,
    required VoidCallback onMaxTap,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF14F1D9),
            height: 1.33,
            letterSpacing: -0.24,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: Container(
                height: 48,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF121418),
                  border: Border.all(color: const Color(0xFF1A2221)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: controller,
                        keyboardType: TextInputType.number,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFF1F7F6),
                          height: 1.43,
                          letterSpacing: -0.28,
                        ),
                        decoration: InputDecoration(
                          border: InputBorder.none,
                          hintText: placeholder,
                          hintStyle: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            fontStyle: FontStyle.italic,
                            color: const Color(0xFF7C837F),
                            height: 1.43,
                            letterSpacing: -0.28,
                          ),
                        ),
                      ),
                    ),
                    Text(
                      'USDT',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF7C837F),
                        height: 0.83,
                        letterSpacing: -0.24,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: onMaxTap,
              child: Container(
                height: 48,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF191B1F),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    'Max',
                    style: GoogleFonts.baloo2(
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFA3A9A6),
                      height: 1.2,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildGasFee() {
    return Row(
      children: [
        Text(
          'GAS FEE:',
          style: GoogleFonts.baloo2(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF6B7A77),
            height: 1.2,
          ),
        ),
        const SizedBox(width: 8),
        SvgPicture.asset(
          AppAssets.convert,
          color: const Color(0xFF6B7A77),
        ),
        const SizedBox(width: 2),
        Text(
          '\$ 13.345',
          style: GoogleFonts.baloo2(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF6B7A77),
            height: 1.0,
          ),
        ),
      ],
    );
  }

  Widget _buildSendButton(SendViewModel viewModel) {
    return GestureDetector(
      onTap: () => viewModel.onSendTap(),
      child: Container(
        width: double.infinity,
        height: 55,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          borderRadius: BorderRadius.circular(32),
          boxShadow: const [
            BoxShadow(
              color: Color(0xFF2F2F2F),
              blurRadius: 12,
              offset: Offset(0, 1),
              inset: true,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Send Token',
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF14F1D9),
                height: 1.21,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              Icons.arrow_forward,
              size: 24,
              color: Color(0xFF14F1D9),
            ),
          ],
        ),
      ),
    );
  }

  @override
  SendViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      SendViewModel();
}
