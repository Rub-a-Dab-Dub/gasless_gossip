import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'chatroom_viewmodel.dart';

class ChatroomView extends StackedView<ChatroomViewModel> {
  final ChatUser? chatUser;
  const ChatroomView({this.chatUser, Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    ChatroomViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: Stack(
        children: [
          // Main content wrapped in SafeArea
          SafeArea(
            child: Stack(
              children: [
                Column(
                  children: [
                    // Top Header
                    _buildTopHeader(viewModel),
                    // Messages
                    Expanded(
                      child: _buildMessagesList(viewModel),
                    ),
                    // Message Input
                    _buildMessageInput(viewModel),
                  ],
                ),
                // Bottom Sheet (appears behind attachment picker)
                if (viewModel.showBottomSheet)
                  GestureDetector(
                    onTap: () => viewModel.hideBottomSheet(),
                    behavior: HitTestBehavior.translucent,
                    child: Container(
                      width: double.infinity,
                      height: double.infinity,
                      child: GestureDetector(
                        onTap: () {}, // Prevent tap from bubbling up
                        child: _buildBottomSheetContent(context, viewModel),
                      ),
                    ),
                  ),
                // Attachment Picker Overlay (always on top)
                if (viewModel.showAttachmentPicker)
                  _buildAttachmentPickerOverlay(context, viewModel),
              ],
            ),
          ),
          // Success Modal OUTSIDE SafeArea - this is the key change
          if (viewModel.showSuccessModal)
            _buildSuccessModal(context, viewModel),
        ],
      ),
    );
  }

  Widget _buildTopHeader(ChatroomViewModel viewModel) {
    return Container(
      height: 59,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Color(0xFF121418),
        border: Border(
          bottom: BorderSide(color: Color(0xFF161F1E), width: 1),
        ),
      ),
      child: Row(
        children: [
          // Back Arrow
          GestureDetector(
            onTap: viewModel.onBackTap,
            child: const Icon(
              Icons.arrow_back,
              color: Color(0xFFF1F7F6),
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          // User Info
          Expanded(
            child: Row(
              children: [
                // Avatar
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2A3533),
                    borderRadius: BorderRadius.circular(14),
                    image: DecorationImage(
                      image: AssetImage(viewModel.chatUser.avatarUrl),
                      fit: BoxFit.cover,
                      onError: (exception, stackTrace) {},
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Name and Status
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      viewModel.chatUser.name,
                      style: GoogleFonts.fredoka(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                      ),
                    ),
                    Text(
                      viewModel.chatUser.isOnline ? 'Online' : 'Offline',
                      style: GoogleFonts.baloo2(
                        fontSize: 10,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF0E9186),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Action Buttons
          Row(
            children: [
              GestureDetector(
                  onTap: viewModel.onSearchTap,
                  child: SvgPicture.asset(AppAssets.search)),
              const SizedBox(width: 30),
              GestureDetector(
                  onTap: viewModel.onMoreOptionsTap,
                  child: SvgPicture.asset(AppAssets.option)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMessagesList(ChatroomViewModel viewModel) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      itemCount: viewModel.messages.length,
      itemBuilder: (context, index) {
        final message = viewModel.messages[index];
        return _buildMessageItem(message, viewModel);
      },
    );
  }

  Widget _buildMessageItem(
      ChatRoomMessage message, ChatroomViewModel viewModel) {
    // Transaction messages have their own layout
    if (message.type == MessageType.transaction) {
      return Container(
        margin: const EdgeInsets.only(bottom: 40),
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: _buildTransactionInfoCard(viewModel, message),
      );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 40),
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        mainAxisAlignment: message.isSentByMe
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (!message.isSentByMe) ...[
            // Message content for sent messages - NO Flexible wrapper
            _buildMessageContent(message),
            const SizedBox(width: 8),
            // Share button for sent messages (right side)
            _buildShareButton(message, viewModel),
          ] else ...[
            // For sent messages, add spacer to push content to right
            const Expanded(child: SizedBox()),

            _buildShareButton(message, viewModel),
            const SizedBox(width: 8),
            // Message content for received messages - NO Flexible wrapper
            _buildMessageContent(message),
          ],
        ],
      ),
    );
  }

  Widget _buildMessageContent(ChatRoomMessage message) {
    if (message.type == MessageType.nft || message.type == MessageType.image) {
      return _buildNftMessage(message);
    }

    // Regular text message
    return Container(
      constraints:
          const BoxConstraints(maxWidth: 280), // Limit text bubble width
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: message.isSentByMe
            ? const Color(0xFF151D1C)
            : const Color(0xFF16191E),
        borderRadius: BorderRadius.only(
          topLeft: const Radius.circular(20),
          topRight: const Radius.circular(20),
          bottomLeft: message.isSentByMe
              ? const Radius.circular(20)
              : const Radius.circular(4),
          bottomRight: message.isSentByMe
              ? const Radius.circular(4)
              : const Radius.circular(20),
        ),
      ),
      child: Column(
        crossAxisAlignment: message.isSentByMe
            ? CrossAxisAlignment.end
            : CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (message.content.isNotEmpty)
            Text(
              message.content,
              style: GoogleFonts.baloo2(fontSize: 14, color: Colors.white),
            ),
          const SizedBox(height: 4),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                message.timestamp,
                style: GoogleFonts.baloo2(
                  fontSize: 10,
                  color: message.isSentByMe
                      ? const Color(0xFF121418).withOpacity(0.7)
                      : const Color(0xFFA3A9A6),
                ),
              ),
              if (message.isSentByMe) ...[
                const SizedBox(width: 4),
                Icon(
                  Icons.done_all,
                  size: 12,
                  color: message.isRead
                      ? const Color(0xFF121418)
                      : const Color(0xFF121418).withOpacity(0.5),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShareButton(
      ChatRoomMessage message, ChatroomViewModel viewModel) {
    return GestureDetector(
      onTap: () => viewModel.onShareTap(message),
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: const Color(0xFF1A2221),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(child: SvgPicture.asset(AppAssets.forward)),
      ),
    );
  }

  Widget _buildMessageInput(ChatroomViewModel viewModel) {
    return Container(
      height: 100,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
      decoration: const BoxDecoration(
        color: Color(0xFF121418),
        border: Border(
          top: BorderSide(color: Color(0xFF161F1E), width: 1),
        ),
      ),
      child: Row(
        children: [
          // Message Input Field
          Expanded(
            child: Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF191E1D),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Row(
                children: [
                  // Emoji Button
                  GestureDetector(
                    onTap: viewModel.onEmojiTap,
                    child: const Icon(
                      Icons.emoji_emotions_outlined,
                      size: 24,
                      color: Color(0xFFD6D8D3),
                    ),
                  ),
                  const SizedBox(width: 1),
                  // Text Input
                  Expanded(
                    child: TextField(
                      controller: viewModel.messageController,
                      onChanged: viewModel.onMessageChanged,
                      style: GoogleFonts.baloo2(
                        fontSize: 14,
                        color: const Color(0xFFD6D8D3),
                      ),
                      decoration: InputDecoration(
                        hintText: 'Whisper...',
                        hintStyle: GoogleFonts.baloo2(
                          fontSize: 14,
                          color: const Color(0xFFD6D8D3),
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.all(10),
                      ),
                      maxLines: 1,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Attachment/Send Button
          GestureDetector(
            onTap: viewModel.messageText.trim().isEmpty
                ? viewModel.onAttachmentTap
                : viewModel.sendMessage,
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: viewModel.messageText.trim().isEmpty
                    ? const Color(0xFF102E2B)
                    : const Color(0xFF14F1D9),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Center(
                child: viewModel.messageText.trim().isEmpty
                    ? Transform.rotate(
                        angle: 0.8,
                        child: const Icon(
                          Icons.attach_file,
                          size: 24,
                          color: Color(0xFF14F1D9),
                        ),
                      )
                    : const Icon(
                        Icons.send,
                        size: 24,
                        color: Color(0xFF121418),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttachmentPickerOverlay(
      BuildContext context, ChatroomViewModel viewModel) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        height: 100,
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
        decoration: const BoxDecoration(
          color: Color(0xFF121418),
          border: Border(
            top: BorderSide(color: Color(0xFF161F1E), width: 1),
          ),
        ),
        child: Row(
          children: [
            // Back Arrow
            GestureDetector(
              onTap: () {
                viewModel.hideBottomSheet();
                viewModel.hideAttachmentPicker();
              },
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF191E1D),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Center(
                  child: Icon(
                    Icons.arrow_back,
                    size: 20,
                    color: Color(0xFFA3A9A6),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Attachment Options
            Expanded(
              child: Row(
                children: [
                  // Files Option
                  Expanded(
                    child: _buildAttachmentOption(
                      context,
                      viewModel,
                      AttachmentType.files,
                      AppAssets.files,
                      'Files',
                      const Color(0xFFD6D8D3),
                    ),
                  ),
                  // Divider
                  Container(
                    width: 1,
                    height: 48,
                    color: const Color(0xFF232C2B),
                  ),
                  // NFTs Option
                  Expanded(
                    child: _buildAttachmentOption(
                      context,
                      viewModel,
                      AttachmentType.nfts,
                      AppAssets.nft,
                      'NFTs',
                      const Color(0xFFD6D8D3),
                    ),
                  ),
                  // Divider
                  Container(
                    width: 1,
                    height: 48,
                    color: const Color(0xFF232C2B),
                  ),
                  // Wallet Option
                  Expanded(
                    child: _buildAttachmentOption(
                      context,
                      viewModel,
                      AttachmentType.wallet,
                      AppAssets.wallet,
                      'Wallet',
                      const Color(0xFFD6D8D3),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttachmentOption(
    BuildContext context,
    ChatroomViewModel viewModel,
    AttachmentType type,
    String svgIcon,
    String label,
    Color color,
  ) {
    // Check if this option is currently selected
    final bool isSelected =
        viewModel.showBottomSheet && viewModel.selectedAttachmentType == type;
    final Color displayColor = isSelected ? const Color(0xFF14F1D9) : color;

    return InkWell(
      onTap: () => _handleAttachmentSelection(context, viewModel, type),
      child: SizedBox(
        height: 48,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon Container
            Center(
                child: SvgPicture.asset(
              svgIcon,
              color: displayColor,
              width: 12,
              height: 12,
            )),
            const SizedBox(height: 2),
            // Label
            Text(
              label,
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: displayColor,
                letterSpacing: -0.02,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleAttachmentSelection(
      BuildContext context, ChatroomViewModel viewModel, AttachmentType type) {
    // This will show the bottom sheet while keeping the attachment picker visible
    viewModel.selectAttachmentType(type);
  }

  Widget _buildBottomSheetContent(
      BuildContext context, ChatroomViewModel viewModel) {
    switch (viewModel.selectedAttachmentType) {
      case AttachmentType.files:
        return _buildFilesBottomSheet(viewModel);
      case AttachmentType.nfts:
        return _buildNFTsBottomSheet(viewModel);
      case AttachmentType.wallet:
        return _buildWalletBottomSheet(viewModel);
    }
  }

  Widget _buildFilesBottomSheet(ChatroomViewModel viewModel) {
    return NotificationListener<DraggableScrollableNotification>(
      onNotification: (notification) {
        if (notification.extent <= 0.1) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            viewModel.hideBottomSheet();
          });
        }
        return false;
      },
      child: DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.0,
        maxChildSize: 0.9,
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
                    margin: const EdgeInsets.only(top: 8),
                    decoration: const BoxDecoration(
                      color: Color(0xFF2A3533),
                      borderRadius: BorderRadius.all(Radius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Title
                  Text(
                    'Select Photos',
                    style: GoogleFonts.fredoka(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFF1F7F6),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Camera and Gallery Options
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        // Camera Option
                        Expanded(
                          child: GestureDetector(
                            onTap: () =>
                                _pickImageFromCamera(context, viewModel),
                            child: Container(
                              height: 120,
                              decoration: BoxDecoration(
                                color: const Color(0xFF2A3533),
                                borderRadius: BorderRadius.circular(8),
                                border:
                                    Border.all(color: const Color(0xFF161F1E)),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.camera_alt,
                                    size: 32,
                                    color: Color(0xFF14F1D9),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Camera',
                                    style: GoogleFonts.baloo2(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w400,
                                      color: const Color(0xFFF1F7F6),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Gallery Option
                        Expanded(
                          child: GestureDetector(
                            onTap: () =>
                                _pickImageFromGallery(context, viewModel),
                            child: Container(
                              height: 120,
                              decoration: BoxDecoration(
                                color: const Color(0xFF2A3533),
                                borderRadius: BorderRadius.circular(8),
                                border:
                                    Border.all(color: const Color(0xFF161F1E)),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.photo_library,
                                    size: 32,
                                    color: Color(0xFF14F1D9),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Gallery',
                                    style: GoogleFonts.baloo2(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w400,
                                      color: const Color(0xFFF1F7F6),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Instructions
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Choose to take a new photo or select from your gallery',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.baloo2(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFA3A9A6),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Future<void> _pickImageFromCamera(
      BuildContext context, ChatroomViewModel viewModel) async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null) {
        viewModel.hideBottomSheet();
        // Handle the selected image
        print('Camera image selected: ${image.path}');
        // You can add logic here to send the image or add it to the chat
      }
    } catch (e) {
      print('Error picking image from camera: $e');
    }
  }

  Future<void> _pickImageFromGallery(
      BuildContext context, ChatroomViewModel viewModel) async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null) {
        viewModel.hideBottomSheet();
        // Handle the selected image
        print('Gallery image selected: ${image.path}');
        // You can add logic here to send the image or add it to the chat
      }
    } catch (e) {
      print('Error picking image from gallery: $e');
    }
  }

  Widget _buildNFTsBottomSheet(ChatroomViewModel viewModel) {
    final nftImages = [
      AppAssets.nft1,
      AppAssets.nft2,
      AppAssets.nft3,
      AppAssets.nft4
    ];

    return NotificationListener<DraggableScrollableNotification>(
      onNotification: (notification) {
        if (notification.extent <= 0.1) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            viewModel.hideBottomSheet();
          });
        }
        return false;
      },
      child: DraggableScrollableSheet(
        initialChildSize: 0.5,
        minChildSize: 0.0,
        maxChildSize: 0.8,
        snap: true,
        snapSizes: const [0.0, 0.5],
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
                    margin: const EdgeInsets.only(top: 8),
                    decoration: const BoxDecoration(
                      color: Color(0xFF2A3533),
                      borderRadius: BorderRadius.all(Radius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Title
                  Text(
                    'Select NFT',
                    style: GoogleFonts.fredoka(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFF1F7F6),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // NFT Grid
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1,
                      ),
                      itemCount: nftImages.length,
                      itemBuilder: (context, index) {
                        final isSelected = viewModel.isNftSelected(index);

                        return GestureDetector(
                          onLongPress: () =>
                              viewModel.toggleNftSelection(index),
                          onTap: () {
                            if (viewModel.hasSelectedNfts) {
                              viewModel.toggleNftSelection(index);
                            } else {
                              viewModel.hideBottomSheet();
                              // Handle single NFT send
                            }
                          },
                          child: Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2A3533),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isSelected
                                        ? const Color(0xFF14F1D9)
                                        : const Color(0xFF161F1E),
                                    width: isSelected ? 3 : 1,
                                  ),
                                  image: DecorationImage(
                                    image: AssetImage(nftImages[index]),
                                    fit: BoxFit.cover,
                                    onError: (exception, stackTrace) {},
                                  ),
                                ),
                              ),
                              // Selection indicator
                              if (isSelected)
                                Positioned(
                                  top: 8,
                                  right: 8,
                                  child: Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF14F1D9),
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFF14F1D9)
                                              .withOpacity(0.4),
                                          blurRadius: 8,
                                          spreadRadius: 2,
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.check,
                                      color: Color(0xFF121418),
                                      size: 16,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Send button (appears when NFTs are selected)
                  if (viewModel.hasSelectedNfts)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: GestureDetector(
                        onTap: viewModel.sendSelectedNfts,
                        child: Container(
                          width: double.infinity,
                          height: 48,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              begin: Alignment.topRight,
                              end: Alignment.bottomLeft,
                              colors: [
                                Color(0xFF15FDE4),
                                Color(0xFF13E5CE),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(32),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Send ${viewModel.selectedNftIndices.length} NFT${viewModel.selectedNftIndices.length > 1 ? 's' : ''}',
                                style: GoogleFonts.fredoka(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 16,
                                  color: const Color(0xFF121418),
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(
                                Icons.send,
                                color: Color(0xFF121418),
                                size: 20,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildWalletBottomSheet(ChatroomViewModel viewModel) {
    return NotificationListener<DraggableScrollableNotification>(
      onNotification: (notification) {
        if (notification.extent <= 0.1) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            viewModel.hideBottomSheet();
          });
        }
        return false;
      },
      child: DraggableScrollableSheet(
        initialChildSize: 0.65,
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
                    height: 3,
                    margin: const EdgeInsets.only(top: 8),
                    decoration: const BoxDecoration(
                      color: Color(0xFF2A3533),
                      borderRadius: BorderRadius.all(Radius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  // Content
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        // Token Info Section (always visible)
                        _buildTokenInfoSection(viewModel),
                        const SizedBox(height: 10),
                        // Conditional: Token Selection or Amount/Send
                        viewModel.showTokenSelection
                            ? _buildTokenSelectionContent(viewModel)
                            : Column(
                                children: [
                                  // Amount Section
                                  _buildAmountSection(viewModel),
                                  const SizedBox(height: 35),
                                  // Send Button
                                  _buildSendButton(context, viewModel),
                                  const SizedBox(height: 40),
                                ],
                              ),
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

  Widget _buildTokenInfoSection(ChatroomViewModel viewModel) {
    return Container(
      height: 65,
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFF161F1E), width: 1),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Send To Section
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Send To:',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                viewModel.chatUser.name,
                style: GoogleFonts.fredoka(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF0E9186),
                ),
              ),
            ],
          ),
          // Your Balance Section
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Your Balance:',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '\$20345.46',
                style: GoogleFonts.fredoka(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAmountSection(ChatroomViewModel viewModel) {
    final amountController = TextEditingController();

    return Column(
      children: [
        // Amount Input Field
        Column(
          children: [
            TextField(
              controller: amountController,
              keyboardType: TextInputType.numberWithOptions(decimal: true),
              textAlign: TextAlign.center,
              style: GoogleFonts.fredoka(
                fontSize: 48,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFF1F7F6),
                height: 40 / 48,
              ),
              cursorColor: const Color(0xFF14F1D9),
              decoration: const InputDecoration(
                border: InputBorder.none,
                hintText: '0',
                hintStyle: TextStyle(
                  color: Color(0xFF2A3533),
                ),
                contentPadding: EdgeInsets.zero,
              ),
            ),
            const SizedBox(height: 12),
            // Amount in USDT
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SvgPicture.asset(AppAssets.convert),
                const SizedBox(width: 4),
                Text(
                  '0 USDT',
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Token Selector
        GestureDetector(
          onTap: () => viewModel.showTokenSelectionSheet(),
          child: Container(
            height: 39,
            padding: const EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF171C1B),
              border: Border.all(color: const Color(0xFF212424)),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF26A17B),
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          viewModel.selectedToken?.iconUrl ?? AppAssets.base,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      viewModel.selectedToken?.symbol ?? 'Base Eth',
                      style: GoogleFonts.baloo2(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFF1F7F6),
                      ),
                    ),
                  ],
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
        ),
        const SizedBox(height: 30),

        // Quick Amount Buttons
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildQuickAmountButton('+5'),
            const SizedBox(width: 9),
            _buildQuickAmountButton('+10'),
            const SizedBox(width: 9),
            _buildQuickAmountButton('+20'),
            const SizedBox(width: 9),
            _buildQuickAmountButton('+30'),
            const SizedBox(width: 9),
            SvgPicture.asset(AppAssets.shuffle),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAmountButton(String amount) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFF161F1E)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Text(
          amount,
          style: GoogleFonts.baloo2(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: const Color(0xFFD6D8D3),
          ),
        ),
      ),
    );
  }

  Widget _buildSendButton(BuildContext context, ChatroomViewModel viewModel) {
    return GestureDetector(
      onTap: () => viewModel.sendToken(),
      child: Container(
        width: 152,
        height: 51,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          borderRadius: BorderRadius.circular(32),
          boxShadow: const [
            BoxShadow(
              color: Color(0xFF0F5951),
              blurRadius: 12,
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
                letterSpacing: -0.02,
              ),
            ),
            SizedBox(width: 8),
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

  Widget _buildTransactionInfoCard(
      ChatroomViewModel viewModel, ChatRoomMessage message) {
    return Row(
      mainAxisAlignment:
          message.isSentByMe ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Flexible(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF121A19),
              border: Border.all(color: const Color(0xFF102E2B)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: IntrinsicWidth(
              // makes width fit its content
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Transaction Text
                  Row(
                    mainAxisSize: MainAxisSize.min, // 👈 important
                    children: [
                      Text(
                        'You transferred ',
                        style: GoogleFonts.baloo2(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFA3A9A6),
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '2 ',
                            style: GoogleFonts.baloo2(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF0E9186),
                            ),
                          ),
                          Container(
                            width: 14,
                            height: 14,
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Color(0xFF26A17B),
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                AppAssets.base,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Text(
                            'Base Eth',
                            style: GoogleFonts.baloo2(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF0E9186),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        ' to ${viewModel.chatUser.name}',
                        style: GoogleFonts.baloo2(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFA3A9A6),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // Timestamp
                  Text(
                    message.timestamp,
                    style: GoogleFonts.baloo2(
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF3C4A47),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        // Info Icon
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(shape: BoxShape.circle),
          child: const Icon(
            Icons.info,
            color: Color(0xFF14F1D9),
            size: 24,
          ),
        ),
      ],
    );
  }

  Widget _buildTokenSelectionContent(ChatroomViewModel viewModel) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Token Options
        ...viewModel.tokens.map((token) => Container(
              margin: const EdgeInsets.only(bottom: 6),
              child: _buildTokenOption(token, viewModel),
            )),
        const SizedBox(height: 20),
        // Close Button
        GestureDetector(
          onTap: () => viewModel.hideTokenSelectionSheet(),
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF1A2221),
              borderRadius: BorderRadius.circular(32),
            ),
            child: const Icon(
              Icons.close,
              color: Color(0xFFF1F7F6),
              size: 24,
            ),
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  Widget _buildTokenOption(Token token, ChatroomViewModel viewModel) {
    final isSelected = token.isSelected;
    return GestureDetector(
      onTap: () => viewModel.selectToken(token),
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF102E2B) : const Color(0xFF17191D),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            // Token Icon
            Container(
              width: 24,
              height: 24,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
              ),
              child: ClipOval(
                child: Image.asset(
                  token.iconUrl,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Token Name
            Expanded(
              child: Text(
                token.symbol,
                style: GoogleFonts.baloo2(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ),
            // Selection Indicator (matching create room style)
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
    );
  }

  Widget _buildSuccessModal(BuildContext context, ChatroomViewModel viewModel) {
    return Positioned.fill(
      child: Container(
        color: const Color(0xFF121A19).withOpacity(0.96),
        child: Column(
          children: [
            // Success Message at top
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 15),
              decoration: BoxDecoration(
                color: const Color(0xFF121A19),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF14F1D9).withOpacity(0.12),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
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
                      color: Color(0xFF14F1D9),
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'You\'ve sent ${viewModel.chatUser.name} 2 Base Eth',
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

            // Spacer to push content to center
            const Spacer(),

            // XP Reward Image and Text - centered content
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // XP Image
                SizedBox(
                  width: 215.17,
                  height: 260,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      // Background image with glow
                      Positioned.fill(
                        child: Image.asset(
                          AppAssets.successful,
                          fit: BoxFit.cover,
                        ),
                      ),
                      // Chick image with rounded bottom
                      Positioned(
                        left: 30.91,
                        top: 25,
                        child: ClipRRect(
                          borderRadius: const BorderRadius.vertical(
                            bottom: Radius.circular(1540),
                          ),
                          child: Image.asset(
                            AppAssets.bigbase,
                            width: 156,
                            height: 167,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                      // XP badge with stroke
                      Positioned(
                        left: (215.17 / 2) - (55 / 4),
                        top: 210,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // Stroke (border text)
                            Text(
                              '2',
                              style: GoogleFonts.fredoka(
                                fontWeight: FontWeight.w600,
                                fontSize: 48,
                                height: 33 / 48,
                                foreground: Paint()
                                  ..style = PaintingStyle.stroke
                                  ..strokeWidth = 12
                                  ..color = const Color(0xFF072824),
                              ),
                            ),
                            // Fill (main text)
                            Text(
                              '2',
                              style: GoogleFonts.fredoka(
                                fontWeight: FontWeight.w600,
                                fontSize: 48,
                                height: 33 / 48,
                                color: const Color(0xFFF1F7F6),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
                // Success Text
                Text(
                  "Tokens sent successfully",
                  style: GoogleFonts.fredoka(
                    fontWeight: FontWeight.w500,
                    fontSize: 24,
                    height: 1.3,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
              ],
            ),

            // Spacer to push buttons to bottom
            const Spacer(),

            // CTA Buttons
            SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                child: Row(
                  children: [
                    // Share Button
                    GestureDetector(
                      onTap: () {
                        // Handle share
                      },
                      child: Container(
                        width: 52,
                        height: 52,
                        decoration: const BoxDecoration(
                          color: Color(0xFF121418),
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                          boxShadow: [
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
                    // Continue Button
                    Expanded(
                      child: GestureDetector(
                        onTap: () => viewModel.onContinueAfterSuccess(),
                        child: Container(
                          height: 52,
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
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNftMessage(ChatRoomMessage message) {
    return SizedBox(
      width: 252,
      height: 349,
      child: Container(
        width: 252,
        height: 349,
        decoration: BoxDecoration(
          border: Border.all(color: const Color(0xFF1A2221), width: 2),
          borderRadius: BorderRadius.circular(12),
          image: DecorationImage(
            image: AssetImage(message.imageUrl ?? 'assets/placeholder_nft.png'),
            fit: BoxFit.cover,
            onError: (exception, stackTrace) {},
          ),
        ),
        child: Container(
          padding: const EdgeInsets.all(8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: message.isSentByMe
                ? CrossAxisAlignment.end
                : CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: message.isSentByMe
                    ? MainAxisAlignment.end
                    : MainAxisAlignment.start,
                children: [
                  // Timestamp
                  Text(
                    message.timestamp,
                    style: GoogleFonts.baloo2(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFFD6D8D3),
                      shadows: [
                        const Shadow(
                          color: Colors.black54,
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 4),
                  // Read status for sent messages
                  if (message.isSentByMe)
                    Icon(
                      Icons.done_all,
                      size: 14,
                      color: message.isRead
                          ? const Color(0xFF7AF8EB)
                          : const Color(0xFFA3A9A6),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  ChatroomViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      ChatroomViewModel(
          chatUser: chatUser ??
              ChatUser(
                id: 'default',
                name: 'Unknown User',
                avatarUrl: 'assets/default_avatar.png',
                isOnline: false,
              ));
}
