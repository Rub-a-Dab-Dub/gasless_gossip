import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';
import 'package:photo_manager/photo_manager.dart';

import 'createpost_viewmodel.dart';

class CreatepostView extends StackedView<CreatepostViewModel> {
  const CreatepostView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    CreatepostViewModel viewModel,
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
                    const SizedBox(height: 16),
                    // Post Input Section
                    _buildPostInputSection(viewModel),
                    const SizedBox(height: 30),
                    // Selected Images Grid (only show when images are selected)
                    if (viewModel.selectedImages.isNotEmpty)
                      _buildSelectedImagesGrid(viewModel),
                    if (viewModel.selectedImages.isNotEmpty)
                      const SizedBox(height: 16),
                    // Recent Photos Section (only show if nothing is selected)
                    if (viewModel.selectedImages.isEmpty &&
                        (viewModel.recentMedia.isNotEmpty ||
                            viewModel.isLoadingMedia))
                      _buildRecentPhotosSection(viewModel),
                    SizedBox(
                      height: 30,
                    ),
                    _buildBottomToolbar(viewModel),
                    const SizedBox(height: 100), // Space for keyboard
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(CreatepostViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Close Button
          GestureDetector(
            onTap: viewModel.goBack,
            child: const Icon(
              Icons.close,
              size: 24,
              color: Color(0xFFF1F7F6),
            ),
          ),
          const Spacer(),
          // Save Draft Button
          GestureDetector(
            onTap: viewModel.saveDraft,
            child: Container(
              width: 104,
              height: 35,
              decoration: BoxDecoration(
                color: Color(0xFF191E1D),
                borderRadius: BorderRadius.circular(32),
              ),
              child: Center(
                child: Text(
                  'Save Draft',
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          // Post Button
          GestureDetector(
            onTap: viewModel.canPost ? viewModel.createPost : null,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              decoration: BoxDecoration(
                color: viewModel.canPost
                    ? const Color(0xFF14F1D9)
                    : const Color(0xFF14F1D9).withOpacity(0.4),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                'Post',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: viewModel.canPost
                      ? const Color(0xFF121418)
                      : const Color(0xFF121418).withOpacity(0.6),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostInputSection(CreatepostViewModel viewModel) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start, // align to top
      children: [
        // Profile Picture (stays fixed at top)
        Container(
          width: 32,
          height: 32,
          decoration: const BoxDecoration(
            color: Colors.grey, // Placeholder for Checker.png
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),
        const SizedBox(width: 12),
        // TextField (expands downward independently)
        Expanded(
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              minHeight: 32, // at least same as avatar
            ),
            child: TextField(
              onChanged: viewModel.updatePostText,
              maxLines: null, // allows multiline
              keyboardType: TextInputType.multiline,
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFF1F7F6),
              ),
              decoration: InputDecoration(
                hintText: "What's Happening?",
                hintStyle: GoogleFonts.baloo2(
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF7C837F),
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectedImagesGrid(CreatepostViewModel viewModel) {
    final images = viewModel.selectedImages;

    return Container(
      // margin: const EdgeInsets.only(left: 52), // Align with text input
      child: images.length == 1
          ? _buildSingleImage(images[0], viewModel)
          : _buildMultipleImagesGrid(images, viewModel),
    );
  }

  Widget _buildSingleImage(File image, CreatepostViewModel viewModel) {
    return Stack(
      children: [
        Container(
          height: 458,
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            image: DecorationImage(
              image: FileImage(image),
              fit: BoxFit.cover,
            ),
          ),
        ),
        // Remove button
        Positioned(
          top: 8,
          right: 8,
          child: GestureDetector(
            onTap: () => viewModel.removeImage(0),
            child: Container(
              width: 24,
              height: 24,
              decoration: const BoxDecoration(
                color: Color(0xFF121418),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.close,
                color: Color(0xFFF1F7F6),
                size: 16,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMultipleImagesGrid(
      List<File> images, CreatepostViewModel viewModel) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1,
      ),
      itemCount: images.length,
      itemBuilder: (context, index) {
        return Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: FileImage(images[index]),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            // Remove button
            Positioned(
              top: 8,
              right: 8,
              child: GestureDetector(
                onTap: () => viewModel.removeImage(index),
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: const BoxDecoration(
                    color: Color(0xFF121418),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.close,
                    color: Color(0xFFF1F7F6),
                    size: 16,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildRecentPhotosSection(CreatepostViewModel viewModel) {
    // Don't show if there's a permission error
    if (viewModel.permissionError != null) {
      return Container(
        margin: const EdgeInsets.only(left: 52),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A2221),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Photos',
              style: GoogleFonts.baloo2(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF7C837F),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              viewModel.permissionError!,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: const Color(0xFF7C837F),
              ),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: viewModel.retryLoadMedia,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF14F1D9),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  'Retry',
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF121418),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Title
        Text(
          'Recent',
          style: GoogleFonts.baloo2(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF7C837F),
          ),
        ),
        const SizedBox(height: 8),
        // Recent Photos Horizontal List
        Container(
          height: 80,
          child: viewModel.isLoadingMedia
              ? const Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFF14F1D9),
                    strokeWidth: 2,
                  ),
                )
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: viewModel.recentMedia.length,
                  itemBuilder: (context, index) {
                    final asset = viewModel.recentMedia[index];
                    return Container(
                      width: 80,
                      margin: const EdgeInsets.only(right: 15),
                      child: GestureDetector(
                        onTap: () => viewModel.selectFromRecentMedia(asset),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: FutureBuilder<Uint8List?>(
                            future: asset.thumbnailDataWithSize(
                              const ThumbnailSize(200, 200),
                            ),
                            builder: (context, snapshot) {
                              if (snapshot.hasData && snapshot.data != null) {
                                return Stack(
                                  fit: StackFit.expand,
                                  children: [
                                    Image.memory(
                                      snapshot.data!,
                                      fit: BoxFit.cover,
                                    ),
                                    // Video indicator
                                    if (asset.type == AssetType.video)
                                      const Positioned(
                                        bottom: 4,
                                        right: 4,
                                        child: Icon(
                                          Icons.play_circle_filled,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                  ],
                                );
                              }
                              return Container(
                                color: const Color(0xFF2A3533),
                                child: const Center(
                                  child: Icon(
                                    Icons.image,
                                    color: Color(0xFF7C837F),
                                    size: 20,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildBottomToolbar(CreatepostViewModel viewModel) {
    return Container(
      child: Row(
        children: [
          // Photo/Gallery Icon
          GestureDetector(
            onTap: viewModel.pickImage,
            child: SvgPicture.asset(
              AppAssets.gallery,
              fit: BoxFit.none,
            ),
          ),
          const SizedBox(width: 30),
          // GIF Icon (placeholder for now)
          GestureDetector(
            onTap: () {
              // TODO: Implement GIF picker
              print('GIF picker tapped');
            },
            child: SvgPicture.asset(
              AppAssets.gift,
              fit: BoxFit.none,
            ),
          ),
          const Spacer(),
          // Character count or additional options can go here
        ],
      ),
    );
  }

  @override
  CreatepostViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      CreatepostViewModel();

  @override
  void onViewModelReady(CreatepostViewModel viewModel) {
    viewModel.loadRecentMedia();
    super.onViewModelReady(viewModel);
  }
}
