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
  transaction,
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

class Token {
  final String name;
  final String symbol;
  final String iconUrl;
  final bool isSelected;

  Token({
    required this.name,
    required this.symbol,
    required this.iconUrl,
    this.isSelected = false,
  });

  Token copyWith({bool? isSelected}) {
    return Token(
      name: name,
      symbol: symbol,
      iconUrl: iconUrl,
      isSelected: isSelected ?? this.isSelected,
    );
  }
}

class ChatroomViewModel extends BaseViewModel {
  final ChatUser chatUser;
  final TextEditingController messageController = TextEditingController();
  final _navigationService = locator<NavigationService>();
  String messageText = '';
  bool _showAttachmentPicker = false;
  AttachmentType _selectedAttachmentType = AttachmentType.files;
  bool _showBottomSheet = false;
  bool _showTokenSelection = false;
  bool _showSuccessModal = false;
  List<Token> _tokens = [];
  Token? _selectedToken;
  List<ChatRoomMessage> _messages = [];
  final Set<int> _selectedNftIndices =
      {}; // Track selected NFT indices from bottom sheet

  ChatroomViewModel({required this.chatUser}) {
    _initializeTokens();
    _initializeMessages();
  }

  bool get showAttachmentPicker => _showAttachmentPicker;
  AttachmentType get selectedAttachmentType => _selectedAttachmentType;
  bool get showBottomSheet => _showBottomSheet;
  bool get showTokenSelection => _showTokenSelection;
  bool get showSuccessModal => _showSuccessModal;
  List<Token> get tokens => _tokens;
  Token? get selectedToken => _selectedToken;
  Set<int> get selectedNftIndices => _selectedNftIndices;
  bool get hasSelectedNfts => _selectedNftIndices.isNotEmpty;

  void _initializeTokens() {
    _tokens = [
      Token(
          name: 'Base Ethereum',
          symbol: 'BASE ETH',
          iconUrl: AppAssets.base,
          isSelected: true),
      Token(name: 'Stellar Lumens', symbol: 'XLM', iconUrl: AppAssets.xlm),
      Token(
        name: 'Tether',
        symbol: 'USDT',
        iconUrl: AppAssets.usdt,
      ),
      Token(name: 'Starknet', symbol: 'STRK', iconUrl: AppAssets.stark),
    ];
    _selectedToken = _tokens.firstWhere((token) => token.isSelected);
  }

  void _initializeMessages() {
    _messages = [
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
  }

  List<ChatRoomMessage> get messages => _messages;

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

  void onEmojiTap() {
    // Open emoji picker
  }

  void onShareTap(ChatRoomMessage message) {
    // Share NFT/image
  }

  void showTokenSelectionSheet() {
    _showTokenSelection = true;
    notifyListeners();
  }

  void hideTokenSelectionSheet() {
    _showTokenSelection = false;
    notifyListeners();
  }

  void selectToken(Token token) {
    _tokens = _tokens
        .map((t) => t.copyWith(isSelected: t.symbol == token.symbol))
        .toList();
    _selectedToken = token;
    _showTokenSelection = false;
    notifyListeners();
  }

  void sendToken() {
    // Hide wallet bottom sheet
    hideBottomSheet();
    hideAttachmentPicker();

    // Show success modal
    _showSuccessModal = true;
    notifyListeners();
  }

  void hideSuccessModal() {
    _showSuccessModal = false;
    notifyListeners();
  }

  void onContinueAfterSuccess() {
    hideSuccessModal();

    // Add transaction message to chat
    final transactionMessage = ChatRoomMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: 'Sent \$50',
      timestamp: '6:45 PM',
      isSentByMe: true,
      isRead: false,
      type: MessageType.transaction,
    );

    _messages.add(transactionMessage);
    notifyListeners();
  }

  // NFT Selection Methods (for bottom sheet NFT grid)
  void toggleNftSelection(int nftIndex) {
    if (_selectedNftIndices.contains(nftIndex)) {
      _selectedNftIndices.remove(nftIndex);
    } else {
      _selectedNftIndices.add(nftIndex);
    }
    notifyListeners();
  }

  void clearNftSelection() {
    _selectedNftIndices.clear();
    notifyListeners();
  }

  bool isNftSelected(int nftIndex) {
    return _selectedNftIndices.contains(nftIndex);
  }

  void sendSelectedNfts() {
    // TODO: Implement sending selected NFTs
    // Sending ${_selectedNftIndices.length} NFTs
    clearNftSelection();
    hideBottomSheet();
  }

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }
}
