import 'dart:typed_data';

import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:photo_manager/photo_manager.dart';
import 'package:stacked/stacked.dart';

import 'uploadavatar_viewmodel.dart';

class UploadavatarView extends StackedView<UploadavatarViewModel> {
  const UploadavatarView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    UploadavatarViewModel viewModel,
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
                    const SizedBox(height: 40),
                    // Title
                    _buildTitle(),
                    const SizedBox(height: 60),
                    // Avatar Upload Section
                    _buildAvatarSection(viewModel),
                    const SizedBox(height: 24),
                    // Image Grid
                    if (viewModel.selectedImages.isNotEmpty)
                      _buildImageGrid(viewModel),
                    if (viewModel.selectedImages.isNotEmpty)
                      const SizedBox(height: 24),
                    _buildRecentPhotosSection(viewModel),
                    const SizedBox(height: 24),

                    _buildBottomToolbar(viewModel),
                    // Icons
                    const SizedBox(height: 40),

                    //create room button
                    _buildCreateRoomButton(viewModel),
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(UploadavatarViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Back Arrow
          GestureDetector(
            onTap: viewModel.goBack,
            child: Transform.scale(
              scaleX: -1,
              child: const Icon(
                Icons.arrow_forward,
                size: 24,
                color: Color(0xFFF1F7F6),
              ),
            ),
          ),
          const SizedBox(width: 6),
          // Title
          Expanded(
            child: Text(
              'create new room',
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFD6D8D3),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTitle() {
    return Align(
      alignment: Alignment.centerLeft,
      child: SizedBox(
        width: 328,
        child: Text(
          'Add an image or logo',
          style: GoogleFonts.baloo2(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            height: 1.625,
            color: const Color(0xFFF1F7F6),
          ),
        ),
      ),
    );
  }

  Widget _buildAvatarSection(UploadavatarViewModel viewModel) {
    return Column(
      children: [
        // Avatar Circle
        GestureDetector(
          onTap: viewModel.pickAvatar,
          child: Container(
            width: 148,
            height: 148,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF1A2221),
              border: Border.all(
                color: const Color(0xFF0E9186),
                width: 2,
              ),
              image: viewModel.avatarImage != null
                  ? DecorationImage(
                      image: FileImage(viewModel.avatarImage!),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: viewModel.avatarImage == null
                ? const Icon(
                    Icons.add_photo_alternate_outlined,
                    size: 48,
                    color: Color(0xFF0E9186),
                  )
                : null,
          ),
        ),
        const SizedBox(height: 16),
        // Upload Button
        GestureDetector(
          onTap: viewModel.pickAvatar,
          child: Container(
            width: 142,
            height: 43,
            decoration: BoxDecoration(
              color: const Color(0xFF162220),
              border: Border.all(
                color: const Color(0xFF0E9186),
                width: 1,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Text(
                'upload image',
                style: GoogleFonts.fredoka(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  letterSpacing: -0.32,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildImageGrid(UploadavatarViewModel viewModel) {
    return SizedBox(
      width: 358,
      height: 84,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          for (int i = 0; i < viewModel.selectedImages.length && i < 4; i++)
            Padding(
              padding: EdgeInsets.only(right: i < 3 ? 12 : 0),
              child: Stack(
                children: [
                  Container(
                    width: 84,
                    height: 84,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: FileImage(viewModel.selectedImages[i]),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 4,
                    right: 4,
                    child: GestureDetector(
                      onTap: () => viewModel.removeImage(i),
                      child: Container(
                        width: 20,
                        height: 20,
                        decoration: const BoxDecoration(
                          color: Color(0xFF121418),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.close,
                          size: 14,
                          color: Color(0xFFF1F7F6),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRecentPhotosSection(UploadavatarViewModel viewModel) {
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
        SizedBox(
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

  Widget _buildBottomToolbar(UploadavatarViewModel viewModel) {
    return Row(
      children: [
          // Photo/Gallery Icon
          GestureDetector(
            onTap: viewModel.pickImages,
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
              // GIF picker tapped
            },
            child: SvgPicture.asset(
              AppAssets.gift,
              fit: BoxFit.none,
            ),
          ),
        const Spacer(),
        // Character count or additional options can go here
      ],
    );
  }

  Widget _buildCreateRoomButton(UploadavatarViewModel viewModel) {
    return Align(
      alignment: Alignment.centerRight,
      child: GestureDetector(
        onTap: viewModel.createRoom,
        child: Container(
          width: 177,
          height: 51,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
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
                inset: true,
              ),
              BoxShadow(
                color: Color(0xFF24FFE7),
                offset: Offset(6, 6),
                blurRadius: 10,
                inset: true,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Create Room',
                style: GoogleFonts.fredoka(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF121418),
                ),
              ),
              const SizedBox(width: 16),
              const Icon(
                Icons.arrow_forward,
                size: 24,
                color: Color(0xFF121418),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  UploadavatarViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      UploadavatarViewModel();

  @override
  void onViewModelReady(UploadavatarViewModel viewModel) {
    viewModel.initialize();
    super.onViewModelReady(viewModel);
  }
}
