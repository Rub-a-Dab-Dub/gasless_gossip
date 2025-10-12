import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'mypage_viewmodel.dart';

class MyPageView extends StackedView<MyPageViewModel> {
  const MyPageView({Key? key}) : super(key: key);

  @override
  Widget builder(
      BuildContext context, MyPageViewModel viewModel, Widget? child) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // ===== TOP HEADER =====
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              height: 80,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back arrow
                  GestureDetector(
                    onTap: () => viewModel.onBackTap(),
                    child: Icon(Icons.arrow_back,
                        color: const Color(0xFFF1F7F6), size: 24),
                  ),

                  // Title
                  Text(
                    viewModel.isEditing ? "edit profile" : "my profile",
                    style: GoogleFonts.fredoka(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFD6D8D3),
                    ),
                  ),

                  // Invisible arrow for spacing balance
                  Opacity(
                    opacity: 0,
                    child: Icon(Icons.arrow_forward_ios,
                        color: const Color(0xFFF1F7F6), size: 24),
                  ),
                ],
              ),
            ),

            // ===== SCROLLABLE CONTENT =====
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // --- About User Card ---
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF121418),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0x1414F1D9).withOpacity(0.02),
                            offset: const Offset(0, 10),
                            blurRadius: 12,
                          ),
                        ],
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                      child: Column(
                        children: [
                          // User Image
                          Container(
                            width: 204,
                            height: 204,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image: AssetImage(AppAssets.bigprofile),
                                fit: BoxFit.cover,
                                alignment: Alignment.center,
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color:
                                      const Color(0xFF222A2A).withOpacity(0.2),
                                  offset: Offset(2, 2),
                                  blurRadius: 1,
                                  spreadRadius: 0,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Edit / Save Button
                          GestureDetector(
                            onTap: () => viewModel.toggleEdit(),
                            child: Container(
                              width: 120,
                              height: 40,
                              decoration: BoxDecoration(
                                color: const Color(0xFF1A1D22),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Center(
                                child: Text(
                                  viewModel.isEditing
                                      ? "Chnage Image"
                                      : "Edit Profile",
                                  style: GoogleFonts.baloo2(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w400,
                                    color: viewModel.isEditing
                                        ? const Color(0xFFD6D8D3)
                                        : const Color(0xFF14F1D9),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 45),

                    // ===== Items Section =====
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        viewModel.isEditing
                            ? _buildInputField(
                                label: "username",
                                controller: viewModel.usernameController,
                              )
                            : _buildItem(
                                label: "userName", value: viewModel.username),
                        const SizedBox(height: 24),
                        viewModel.isEditing
                            ? _buildInputField(
                                label: "about",
                                controller: viewModel.aboutController,
                              )
                            : _buildItem(
                                label: "about", value: viewModel.about),
                        const SizedBox(height: 24),
                        viewModel.isEditing
                            ? _buildInputField(
                                label: "email",
                                controller: viewModel.emailController,
                              )
                            : _buildItem(
                                label: "email", value: viewModel.email),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Static view
  Widget _buildItem({required String label, required String value}) {
    return SizedBox(
      width: 390,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toLowerCase(),
            style: GoogleFonts.fredoka(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF6B7A77),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.baloo2(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFF1F7F6),
            ),
          ),
        ],
      ),
    );
  }

  /// Editable input field
  Widget _buildInputField(
      {required String label, required TextEditingController controller}) {
    return Container(
      width: 390,
      //padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toLowerCase(),
            style: GoogleFonts.fredoka(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFA3A9A6),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF1A2221)),
              borderRadius: BorderRadius.circular(12),
              color: const Color(0xFF121418),
            ),
            child: TextField(
              controller: controller,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFF1F7F6),
              ),
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 16),
                border: InputBorder.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  MyPageViewModel viewModelBuilder(BuildContext context) => MyPageViewModel();
}
