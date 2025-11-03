import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'swap_viewmodel.dart';

class SwapView extends StackedView<SwapViewModel> {
  const SwapView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    SwapViewModel viewModel,
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
                    _buildSwapHeader(),
                    const SizedBox(height: 32),
                    _buildSwapCards(viewModel),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        child: SafeArea(
          minimum: const EdgeInsets.only(bottom: 8),
          child: _buildSwapButton(viewModel),
        ),
      ),
    );
  }

  Widget _buildTopBar(SwapViewModel viewModel) {
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
              'swap',
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

  Widget _buildSwapHeader() {
    return Column(
      children: [
        Text(
          'SWAP',
          style: GoogleFonts.baloo2(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF0E9186),
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Tokens',
          style: GoogleFonts.baloo2(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: const Color(0xFFF1F7F6),
            height: 1.14,
          ),
        ),
      ],
    );
  }

  Widget _buildSwapCards(SwapViewModel viewModel) {
    return Column(
      children: [
        // From Card
        _buildFromCard(viewModel),
        const SizedBox(height: 4),
        // To Card
        _buildToCard(viewModel),
      ],
    );
  }

  Widget _buildFromCard(SwapViewModel viewModel) {
    return Container(
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
            color: const Color(0xFF14F1D9).withValues(alpha: 0.04),
            blurRadius: 24,
            offset: const Offset(0, 0),
            inset: true,
          ),
        ],
      ),
      child: Column(
        children: [
          // Top row - From label and balance
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'From:',
                style: GoogleFonts.baloo2(
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF6B7A77),
                  height: 1.2,
                ),
              ),
              Row(
                children: [
                  Text(
                    'balance: \$ 3,000',
                    style: GoogleFonts.baloo2(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFA3A9A6),
                      height: 1.58,
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => viewModel.onMaxFromTap(),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF191B1F),
                        borderRadius: BorderRadius.circular(20),
                      ),
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
                ],
              ),
            ],
          ),
          const SizedBox(height: 6),
          // Bottom row - Token selector and amount
          Row(
            children: [
              // Token selector
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF191B1F),
                  border: Border.all(color: const Color(0xFF202226)),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 24,
                      width: 24,
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
                    const SizedBox(width: 8),
                    const Icon(
                      Icons.keyboard_arrow_down,
                      size: 20,
                      color: Color(0xFFA3A9A6),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              // Amount display
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '0',
                      style: GoogleFonts.baloo2(
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                        height: 1.0,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        SvgPicture.asset(
                          AppAssets.convert,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF6B7A77),
                            BlendMode.srcIn,
                          ),
                        ),
                        const SizedBox(width: 2),
                        Text(
                          '\$ 0',
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
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildToCard(SwapViewModel viewModel) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
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
            color: const Color(0xFF14F1D9).withValues(alpha: 0.04),
            blurRadius: 24,
            offset: const Offset(0, 0),
            inset: true,
          ),
        ],
      ),
      child: Column(
        children: [
          // Top row - To label
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'To:',
                style: GoogleFonts.baloo2(
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF6B7A77),
                  height: 1.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          // Bottom row - Token selector and amount
          Row(
            children: [
              // Token selector
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF191B1F),
                  border: Border.all(color: const Color(0xFF202226)),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 24,
                      width: 24,
                      child: Image.asset(AppAssets.usdt),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'USDT',
                      style: GoogleFonts.baloo2(
                        fontSize: 12,
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
              const SizedBox(width: 10),
              // Amount display
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '0',
                      style: GoogleFonts.baloo2(
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                        height: 1.0,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        SvgPicture.asset(
                          AppAssets.convert,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF6B7A77),
                            BlendMode.srcIn,
                          ),
                        ),
                        const SizedBox(width: 2),
                        Text(
                          '\$ 0',
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
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSwapButton(SwapViewModel viewModel) {
    return GestureDetector(
      onTap: () => viewModel.onSwapTap(),
      child: Container(
        width: double.infinity,
        height: 55,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF2F2F2F),
              blurRadius: 12,
              offset: const Offset(0, 1),
              inset: true,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Swap Token',
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
  SwapViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      SwapViewModel();
}
