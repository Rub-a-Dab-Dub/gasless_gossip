import 'dart:ui';
import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'signup_viewmodel.dart';

class SignupView extends StackedView<SignupViewModel> {
  const SignupView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    SignupViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SingleChildScrollView(
        child: SizedBox(
          width: double.infinity,
          height: MediaQuery.of(context).size.height,
          child: Stack(
            children: [
              // Background decorations (kept as you had them)
              Positioned(
                right: -19,
                top: 52,
                child: _decorBox(122, 104),
              ),
              Positioned(
                left: -19,
                top: 176,
                child: _decorBox(84, 110),
              ),

              // Main content
              Column(
                children: [
                  _buildTopSection(),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 42, 16, 0),
                      child: Column(
                        children: [
                          // Input fields
                          Column(
                            children: [
                              _buildInputField(
                                controller: viewModel.usernameController,
                                label: "username",
                                placeholder: 'e.g. “MaskedParrot88”',
                              ),
                              const SizedBox(height: 40),
                              _buildInputField(
                                controller: viewModel.passwordController,
                                label: "create password",
                                placeholder: 'e.g. asjdkskajn',
                                showIcon: true,
                                isPassword: true,
                                showPassword: viewModel.showPassword,
                                togglePassword: viewModel.togglePassword,
                              ),
                              const SizedBox(height: 40),
                              _buildInputField(
                                controller: viewModel.confirmPasswordController,
                                label: "confirm password",
                                placeholder: 'e.g. asjdkskajn',
                                showIcon: true,
                                isPassword: true,
                                showPassword: viewModel.showPassword,
                                togglePassword: viewModel.togglePassword,
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          Align(
                            alignment: Alignment.centerRight,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              width: 177,
                              height: 51,
                              decoration: viewModel.allFilled
                                  ? BoxDecoration(
                                      gradient: const LinearGradient(
                                        begin: Alignment.bottomRight,
                                        end: Alignment.topLeft,
                                        colors: [
                                          Color(0xFF15FDE4),
                                          Color(0xFF13E5CE),
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(32),
                                      boxShadow: const [
                                        BoxShadow(
                                          color: Color(0xFF1E9E90),
                                          offset: Offset(-6, -6),
                                          blurRadius: 12,
                                          spreadRadius: 0,
                                          inset: true,
                                        ),
                                        BoxShadow(
                                          color: Color(0xFF24FFE7),
                                          offset: Offset(6, 6),
                                          blurRadius: 10,
                                          spreadRadius: 0,
                                          inset: true,
                                        ),
                                      ],
                                    )
                                  : BoxDecoration(
                                      color: const Color(0xFF121418),
                                      borderRadius: BorderRadius.circular(32),
                                      boxShadow: const [
                                        BoxShadow(
                                          color: Color(0xFF2F2F2F),
                                          offset: Offset(0, 1),
                                          blurRadius: 12,
                                          spreadRadius: 0,
                                          inset: true,
                                        ),
                                      ],
                                    ),
                              child: Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  borderRadius: BorderRadius.circular(32),
                                  onTap: viewModel.allFilled
                                      ? viewModel.getStarted
                                      : null,
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 24, vertical: 16),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          "Continue",
                                          style: GoogleFonts.fredoka(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w500,
                                            color: viewModel.allFilled
                                                ? const Color(0xFF121418)
                                                : const Color(0xFFF1F7F6),
                                            letterSpacing: -0.02,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Icon(
                                          Icons.arrow_forward,
                                          color: viewModel.allFilled
                                              ? const Color(0xFF121418)
                                              : const Color(0xFFF1F7F6),
                                          size: 24,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _decorBox(double w, double h) {
    return Container(
      width: w,
      height: h,
      decoration: BoxDecoration(
        color: const Color(0xFF0F5951).withValues(alpha: 0.16),
        border: Border.all(color: const Color(0xFF0E9186), width: 2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F5951).withValues(alpha: 0.24),
            offset: const Offset(4, 8),
            blurRadius: 5.5,
          ),
        ],
      ),
    );
  }

  // Widget _pngOrFallback(String pngAssetPath,
  //     {double? width, double? height, Color? color}) {
  //   try {
  //     return Image.asset(
  //       pngAssetPath,
  //       width: width,
  //       height: height,
  //       fit: BoxFit.contain,
  //       color: color?.withValues(alpha: 0.5),
  //     );
  //   } catch (_) {
  //     // final fallback: a decorated container (keeps placement)
  //     return Container(
  //       width: width,
  //       height: height,
  //       decoration: BoxDecoration(
  //         color: const Color.fromRGBO(15, 89, 81, 0.16),
  //         border: Border.all(color: const Color(0xFF0E9186), width: 2),
  //         boxShadow: const [
  //           BoxShadow(
  //             color: Color.fromRGBO(15, 89, 81, 0.24),
  //             offset: Offset(4, 8),
  //             blurRadius: 2,
  //           ),
  //         ],
  //       ),
  //     );
  //   }
  // }

  // Top section with logo and branding (placement preserved)
  Widget _buildTopSection() {
    return Container(
      width: double.infinity,
      height: 400,
      decoration: const BoxDecoration(
        color: Color(0xFF121418),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF0F5951),
            blurRadius: 20,
            spreadRadius: -1,
            offset: Offset(-1, 1),
            inset: true,
          ),
        ],
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(60),
          bottomRight: Radius.circular(60),
        ),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Left vector
          Positioned(
            left: 0, // slight shift outward
            top: 200, // lowered a bit for balance
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 2.2, sigmaY: 2.2),
              child: SvgPicture.asset(
                AppAssets.vector1,
                width: 90,
                height: 115,
                colorFilter:
                    const ColorFilter.mode(Color(0xFF0E9186), BlendMode.srcIn),
              ),
            ),
          ),

          // Right vector
          Positioned(
            right: 0, // slight outward shift to match left
            top: 90, // lower so it feels balanced
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 2.2, sigmaY: 2.2),
              child: SvgPicture.asset(
                AppAssets.vector2,
                width: 125,
                height: 115,
                colorFilter:
                    const ColorFilter.mode(Color(0xFF0E9186), BlendMode.srcIn),
              ),
            ),
          ),

          // Branding content
          Padding(
            padding: const EdgeInsets.fromLTRB(0, 60, 0, 48),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Column(
                  children: [
                    SizedBox(
                      width: 76,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset(
                            AppAssets.logo,
                            height: 137.6,
                            fit: BoxFit.contain,
                          ),
                          const SizedBox(height: 11.92),
                          SizedBox(
                            width: 55.64,
                            height: 5.46,
                            child: ClipOval(
                              child: Container(
                                color:
                                    const Color.fromRGBO(102, 255, 242, 0.24),
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "Ready to spill the tea?",
                      style: GoogleFonts.baloo2(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                        height: 1.625,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                Text(
                  "Sign Up",
                  style: GoogleFonts.fredoka(
                    fontSize: 32,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF7AF8EB),
                    height: 1.22,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Input field builder — kept your stacked floating label, fixed password icon logic
  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required String placeholder,
    bool showIcon = false,
    bool isPassword = false,
    bool showPassword = false,
    VoidCallback? togglePassword,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 70,
      child: Stack(
        children: [
          Positioned(
            top: 12,
            left: 0,
            right: 0,
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFF121418),
                border: Border.all(color: const Color(0xFF1A2221)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: controller,
                        obscureText: isPassword && !showPassword,
                        cursorColor: const Color(0xFF14F1D9),
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.white, // 👈 user input text color
                          letterSpacing: -0.02,
                          height: 1.43,
                        ),
                        decoration: InputDecoration(
                          hintText: placeholder,
                          hintStyle: GoogleFonts.inter(
                            fontSize: 14,
                            fontStyle: FontStyle.italic,
                            color: const Color(0xFF7C837F),
                            letterSpacing: -0.02,
                          ),
                          border: InputBorder.none,
                          isCollapsed: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                      ),
                    ),
                    if (showIcon)
                      IconButton(
                        onPressed: isPassword ? togglePassword : null,
                        icon: Icon(
                          isPassword
                              ? (showPassword
                                  ? Icons.visibility
                                  : Icons.visibility_off)
                              : Icons.info_outline,
                          color: const Color(0xFF7C837F),
                          size: 20,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          // floating label
          Positioned(
            left: 12,
            top: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF0F443E),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                label,
                style: GoogleFonts.fredoka(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF14F1D9),
                  letterSpacing: -0.02,
                  height: 1.33,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  SignupViewModel viewModelBuilder(BuildContext context) => SignupViewModel();
}
