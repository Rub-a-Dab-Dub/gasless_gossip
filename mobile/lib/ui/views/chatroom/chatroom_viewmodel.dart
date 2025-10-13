import 'package:flutter/material.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

// Models
class ChatRoomMessage {
  final String id;
  final String content;
  final String timestamp;
  final bool isSentByMe;
  final bool isRead;
  final MessageType type;
  final String? imageUrl;

  ChatRoomMessage({
    required this.id,
    required this.content,
    required this.timestamp,
    required this.isSentByMe,
    this.isRead = false,
    this.type = MessageType.text,
    this.imageUrl,
  });
}

enum MessageType {
  text,
  image,
  nft,
}

class ChatUser {
  final String id;
  final String name;
  final String avatarUrl;
  final bool isOnline;

  ChatUser({
    required this.id,
    required this.name,
    required this.avatarUrl,
    this.isOnline = false,
  });
}

enum AttachmentType {
  files,
  nfts,
  wallet,
}

class ChatroomViewModel extends BaseViewModel {
  final ChatUser chatUser;
  final TextEditingController messageController = TextEditingController();
  final _navigationService = locator<NavigationService>();
  String messageText = '';
  bool _showAttachmentPicker = false;
  AttachmentType _selectedAttachmentType = AttachmentType.files;
  bool _showBottomSheet = false;

  ChatroomViewModel({required this.chatUser});

  bool get showAttachmentPicker => _showAttachmentPicker;
  AttachmentType get selectedAttachmentType => _selectedAttachmentType;
  bool get showBottomSheet => _showBottomSheet;

  List<ChatRoomMessage> get messages => [
        // Received message (should appear on LEFT)
        ChatRoomMessage(
          id: '1',
          content: 'Hey! How are you doing?',
          timestamp: '6:30 PM',
          isSentByMe: false,
          isRead: true,
          type: MessageType.text,
        ),
        // Sent message (should appear on RIGHT)
        ChatRoomMessage(
          id: '2',
          content: 'I\'m doing great! Thanks for asking 😊',
          timestamp: '6:32 PM',
          isSentByMe: true,
          isRead: true,
          type: MessageType.text,
        ),
        // Received NFT (should appear on LEFT)
        ChatRoomMessage(
            id: '3',
            content: '',
            timestamp: '6:35 PM',
            isSentByMe: false,
            isRead: true,
            type: MessageType.nft,
            imageUrl: AppAssets.imag4),
        // Sent NFT (should appear on RIGHT)
        ChatRoomMessage(
            id: '4',
            content: '',
            timestamp: '6:41 PM',
            isSentByMe: true,
            isRead: true,
            type: MessageType.nft,
            imageUrl: AppAssets.imag3),
        // Another received message (should appear on LEFT)
        ChatRoomMessage(
          id: '5',
          content: 'Nice NFT! Where did you get it?',
          timestamp: '6:43 PM',
          isSentByMe: false,
          isRead: true,
          type: MessageType.text,
        ),
      ];

  void onMessageChanged(String value) {
    messageText = value;
    notifyListeners();
  }

  void sendMessage() {
    if (messageText.trim().isNotEmpty) {
      // Add message to list and send
      messageController.clear();
      messageText = '';
      notifyListeners();
    }
  }

  void onBackTap() {
    // Navigate back to chats list
    _navigationService.back();
  }

  void onSearchTap() {
    // Open search in chat
  }

  void onMoreOptionsTap() {
    // Show more options menu
  }

  void onAttachmentTap() {
    _showAttachmentPicker = true;
    notifyListeners();
  }

  void hideAttachmentPicker() {
    _showAttachmentPicker = false;
    notifyListeners();
  }

  void selectAttachmentType(AttachmentType type) {
    _selectedAttachmentType = type;
    _showBottomSheet = true;
    // Keep the attachment picker visible when showing bottom sheets
    notifyListeners();
  }

  void hideBottomSheet() {
    _showBottomSheet = false;
    notifyListeners();
  }

  void _showFilesBottomSheet() {
    // This will be called from the view
    print("Show files bottom sheet");
  }

  void _showNFTsBottomSheet() {
    // This will be called from the view
    print("Show NFTs bottom sheet");
  }

  void _showWalletBottomSheet() {
    // This will be called from the view
    print("Show wallet bottom sheet");
  }

  void onEmojiTap() {
    // Open emoji picker
  }

  void onShareTap(ChatRoomMessage message) {
    // Share NFT/image
  }

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }
}
