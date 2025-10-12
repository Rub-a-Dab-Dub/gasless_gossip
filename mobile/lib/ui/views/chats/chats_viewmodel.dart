import 'package:mobile/ui/common/app_assets.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/ui/views/chatroom/chatroom_view.dart';
import 'package:mobile/ui/views/chatroom/chatroom_viewmodel.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class ChatMessage {
  final String id;
  final String userName;
  final String lastMessage;
  final String timestamp;
  final String avatarUrl;
  final int unreadCount;
  final bool isRead;
  final bool isSentByMe;

  ChatMessage({
    required this.id,
    required this.userName,
    required this.lastMessage,
    required this.timestamp,
    required this.avatarUrl,
    this.unreadCount = 0,
    this.isRead = true,
    this.isSentByMe = false,
  });
}

class ChatsViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  int selectedNavIndex = 2; // Chat is active
  String searchQuery = '';

  List<ChatMessage> get allChats => [
        ChatMessage(
          id: '1',
          userName: 'Dv_nmd',
          lastMessage: 'hey, what\'s good?',
          timestamp: '2:24 PM',
          avatarUrl: AppAssets.pic,
          unreadCount: 1,
          isRead: false,
          isSentByMe: false,
        ),
        ChatMessage(
          id: '2',
          userName: 'Xaxoo',
          lastMessage: 'thanks for the help earlier!',
          timestamp: '1:15 PM',
          avatarUrl: AppAssets.pic,
          unreadCount: 2,
          isRead: false,
          isSentByMe: false,
        ),
        ChatMessage(
          id: '3',
          userName: 'Maria Garcia',
          lastMessage: 'how\'s work going?',
          timestamp: '12:30 PM',
          avatarUrl: AppAssets.pic,
          unreadCount: 0,
          isRead: true,
          isSentByMe: true,
        ),
        ChatMessage(
          id: '4',
          userName: 'David Chen',
          lastMessage: 'see you tomorrow at the meeting',
          timestamp: '11:45 AM',
          avatarUrl: AppAssets.pic,
          unreadCount: 0,
          isRead: true,
          isSentByMe: true,
        ),
        ChatMessage(
          id: '5',
          userName: 'Alex Johnson',
          lastMessage: 'thanks for the help earlier!',
          timestamp: '1:15 PM',
          avatarUrl: AppAssets.pic,
          unreadCount: 2,
          isRead: false,
          isSentByMe: false,
        ),
        ChatMessage(
          id: '6',
          userName: 'Sir Emmy',
          lastMessage: 'hey, what\'s good?',
          timestamp: '2:24 PM',
          avatarUrl: AppAssets.pic,
          unreadCount: 1,
          isRead: false,
          isSentByMe: false,
        ),
        ChatMessage(
          id: '7',
          userName: 'Flora Osatuyi',
          lastMessage: 'see you tomorrow at the meeting',
          timestamp: '11:45 AM',
          avatarUrl: AppAssets.pic,
          unreadCount: 0,
          isRead: true,
          isSentByMe: true,
        ),
      ];

  List<ChatMessage> get filteredChats {
    if (searchQuery.isEmpty) return allChats;
    return allChats
        .where((chat) =>
            chat.userName.toLowerCase().contains(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().contains(searchQuery.toLowerCase()))
        .toList();
  }

  void onSearchChanged(String query) {
    searchQuery = query;
    notifyListeners();
  }

  void onChatTap(ChatMessage chat) {
    // Convert ChatMessage to ChatUser for navigation
    final chatUser = ChatUser(
      id: chat.id,
      name: chat.userName,
      avatarUrl: chat.avatarUrl,
      isOnline: true, // You can determine this based on your logic
    );

    // Navigate to chatroom with the user data
    _navigationService.navigateWithTransition(
      ChatroomView(chatUser: chatUser),
      transitionStyle: Transition.rightToLeft,
    );
  }

  void selectNavItem(int index) {
    selectedNavIndex = index;
    notifyListeners();
  }

  void onBackTap() {
    // Navigate back
  }

  void onSettingsTap() {
    // Open settings
  }

  void onNewChatTap() {
    // Start new chat
  }

  void onSearchTap() {
    // Focus search
  }
}
