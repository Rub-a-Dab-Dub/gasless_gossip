import 'dart:ui';

import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stacked/stacked.dart';
import 'package:mobile/ui/common/app_assets.dart';

import 'signup_successful_viewmodel.dart';

class SignupSuccessfulView extends StackedView<SignupSuccessfulViewModel> {
  const SignupSuccessfulView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    SignupSuccessfulViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
        child: Container(
          color: const Color(0xFF121A19).withValues(alpha: 0.88),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildSuccessMessage(),
              _buildCenterContent(viewModel),
              _buildBottomCTA(viewModel),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessMessage() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF121A19),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(12),
          bottomRight: Radius.circular(12),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF14F1D9).withValues(alpha: 0.12),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.check_circle,
                color: Color(0xFF14F1D9),
                size: 24,
              ),
              const SizedBox(width: 8),
              Text(
                'You’ve successfully created an account',
                style: GoogleFonts.fredoka(
                  fontSize: 14,
                  height: 1.2,
                  letterSpacing: -0.28,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCenterContent(SignupSuccessfulViewModel viewModel) {
    return Column(
      children: [
        SizedBox(
          width: 215.17,
          height: 260,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // 1. First image (background/glow png)
              Positioned.fill(
                child: Image.asset(
                  AppAssets.successful,
                  fit: BoxFit.cover,
                ),
              ),

              // 3. Chick image with rounded bottom
              Positioned(
                left: 25.91,
                top: 20,
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    bottom: Radius.circular(1540),
                  ),
                  child: Image.asset(
                    AppAssets.chick,
                    width: 156,
                    height: 167,
                    fit: BoxFit.cover,
                  ),
                ),
              ),

              // 4. XP badge
              Positioned(
                left: (200.17 / 10) - (55 / 1) + 0.5,
                top: 210,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Stroke (border text)
                    Text(
                      'Chick-Chatter',
                      style: GoogleFonts.fredoka(
                        fontWeight: FontWeight.w600,
                        fontSize: 48,
                        height: 33 / 48,
                        foreground: Paint()
                          ..style = PaintingStyle.stroke
                          ..strokeWidth = 6
                          ..color = const Color(0xFF072824), // border color
                      ),
                    ),
                    // Fill (main text)
                    Text(
                      'Chick-Chatter',
                      style: GoogleFonts.fredoka(
                        fontWeight: FontWeight.w600,
                        fontSize: 48,
                        height: 33 / 48,
                        color: const Color(0xFFF1F7F6), // fill color
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 40),
        Column(
          children: [
            Text(
              "Welcome, Xaxxo",
              style: GoogleFonts.fredoka(
                fontWeight: FontWeight.w500,
                fontSize: 24,
                height: 1.3,
                color: const Color(0xFFF1F7F6),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: 358,
              child: Text(
                'Complete task and earn points (XP)\n to grow your pet',
                textAlign: TextAlign.center,
                style: GoogleFonts.baloo2(
                  fontSize: 16,
                  height: 1.5,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBottomCTA(SignupSuccessfulViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 48),
      child: Row(
        children: [
          // Share button
          InkWell(
            onTap: viewModel.onShare,
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFF121418),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0xFF0F5951),
                    offset: Offset(0, 1),
                    blurRadius: 12,
                    spreadRadius: 0,
                    inset: true,
                  ),
                ],
              ),
              child: const Icon(
                Icons.ios_share,
                color: Color(0xFF14F1D9),
                size: 20,
              ),
            ),
          ),

          const SizedBox(width: 16),

          // Get Started button
          Expanded(
            child: InkWell(
              onTap: viewModel.onGetStarted,
              child: Container(
                height: 51,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topRight,
                    end: Alignment.bottomLeft,
                    colors: [
                      Color(0xFF15FDE4),
                      Color(0xFF13E5CE),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xFF1E9E90),
                      offset: Offset(-6, -6),
                      blurRadius: 12,
                      inset: true,
                    ),
                    BoxShadow(
                      color: Color(0xFF24FFE7),
                      offset: Offset(6, 6),
                      blurRadius: 10,
                      inset: true,
                    ),
                  ],
                  borderRadius: BorderRadius.all(Radius.circular(32)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Continue',
                      style: GoogleFonts.fredoka(
                        fontWeight: FontWeight.w500,
                        fontSize: 16,
                        height: 1.2,
                        color: const Color(0xFF121418),
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Icon(
                      Icons.arrow_forward,
                      color: Color(0xFF121418),
                      size: 24,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  SignupSuccessfulViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      SignupSuccessfulViewModel();
}
