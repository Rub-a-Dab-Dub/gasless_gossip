import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'createroom_viewmodel.dart';

class CreateroomView extends StackedView<CreateroomViewModel> {
  const CreateroomView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    CreateroomViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(viewModel),
            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    const SizedBox(height: 24),
                    // Form Fields
                    _buildFormFields(viewModel),
                    const SizedBox(height: 24),
                    // Create Button
                    _buildCreateButton(viewModel),
                    const SizedBox(height: 120), // Space for bottom nav
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      // Bottom Navigation
    );
  }

  Widget _buildHeader(CreateroomViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Back Arrow
          GestureDetector(
            onTap: viewModel.goBack,
            child: const Icon(
              Icons.arrow_back,
              size: 24,
              color: Color(0xFFF1F7F6),
            ),
          ),
          const SizedBox(width: 6),
          // Title
          Expanded(
            child: Text(
              'Create new room',
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFD6D8D3),
              ),
            ),
          ),
          // Logo
          SizedBox(
            width: 18,
            height: 32,
            child: Image.asset(AppAssets.logo),
          ),
        ],
      ),
    );
  }

  Widget _buildFormFields(CreateroomViewModel viewModel) {
    return Column(
      children: [
        // Nickname Field
        _buildNicknameField(viewModel),
        const SizedBox(height: 40),
        // Duration Field
        _buildDurationField(viewModel),
        const SizedBox(height: 40),
        // Access Field
        _buildAccessField(viewModel),
      ],
    );
  }

  Widget _buildNicknameField(CreateroomViewModel viewModel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'room name',
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF14F1D9),
          ),
        ),
        const SizedBox(height: 8),
        // Input
        Container(
          height: 48,
          decoration: BoxDecoration(
            border: Border.all(color: const Color(0xFF1A2221)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            onChanged: viewModel.updateNickname,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFF1F7F6),
            ),
            decoration: InputDecoration(
              hintText: 'e.g. "MaskedParrot88"',
              hintStyle: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                fontStyle: FontStyle.italic,
                color: const Color(0xFF7C837F),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDurationField(CreateroomViewModel viewModel) {
    final durations = ['30 min', '1 hour', '2 hours', '4 hours'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Open for',
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF14F1D9),
          ),
        ),
        const SizedBox(height: 8),
        // Duration Options
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: durations.asMap().entries.map((entry) {
            final index = entry.key;
            final duration = entry.value;
            final isSelected = viewModel.selectedDurationIndex == index;

            return GestureDetector(
              onTap: () => viewModel.selectDuration(index),
              child: Container(
                width: 80,
                height: 48,
                decoration: BoxDecoration(
                  color:
                      isSelected ? const Color(0xFF102E2B) : Colors.transparent,
                  border: Border.all(
                    width: 1.5,
                    color: const Color(0xFF161F1E),
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    duration,
                    style: GoogleFonts.baloo2(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFD6D8D3),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildAccessField(CreateroomViewModel viewModel) {
    final accessTypes = ['Open', 'Token-gated', 'Invite-only'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Access',
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF14F1D9),
          ),
        ),
        const SizedBox(height: 8),
        // Access Options
        Column(
          children: accessTypes.asMap().entries.map((entry) {
            final index = entry.key;
            final accessType = entry.value;
            final isSelected = viewModel.selectedAccessIndex == index;

            return Container(
              margin: const EdgeInsets.only(bottom: 6),
              child: GestureDetector(
                onTap: () => viewModel.selectAccess(index),
                child: Container(
                  height: 44,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFF102E2B)
                        : const Color(0xFF17191D),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          accessType,
                          style: GoogleFonts.baloo2(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFFF1F7F6),
                          ),
                        ),
                      ),
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF14F1D9) // active background
                              : const Color(0xFF121418), // inactive background
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF0E9186) // active border
                                : const Color(0xFF2A3533), // inactive border
                            width: 2,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildCreateButton(CreateroomViewModel viewModel) {
    final isActive = viewModel.isFormValid;

    return Align(
      alignment: Alignment.centerRight,
      child: GestureDetector(
        onTap: isActive ? viewModel.createRoom : null,
        child: Container(
          width: 177,
          height: 51,
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF14F1D9) : const Color(0xFF121418),
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: isActive
                    ? const Color(0xFF121418)
                    : const Color(0xFF2F2F2F),
                offset: const Offset(0, 1),
                blurRadius: 12,
                inset: true,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Next',
                style: GoogleFonts.fredoka(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: isActive
                      ? const Color(0xFF121418)
                      : const Color(0xFFF1F7F6),
                ),
              ),
              const SizedBox(width: 16),
              Icon(
                Icons.arrow_forward,
                size: 24,
                color: isActive
                    ? const Color(0xFF121418)
                    : const Color(0xFFF1F7F6),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  CreateroomViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      CreateroomViewModel();
}
