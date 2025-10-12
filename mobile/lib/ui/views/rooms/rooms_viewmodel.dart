import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class Room {
  final String name;
  final String description;
  final String imageUrl;
  final int memberCount;
  final int reactions;
  final String timeLeft;
  final List<String> memberAvatars;

  Room({
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.memberCount,
    required this.reactions,
    required this.timeLeft,
    required this.memberAvatars,
  });
}

class RoomsViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  int selectedTabIndex = 0;
  int selectedNavIndex = 3; // FilmStrip is active
  List<String> filterOptions = [
    'Sports',
    'Trending Markets',
    'Music',
    'Gaming'
  ];
  int selectedFilterIndex = -1;

  // All rooms (public rooms)
  List<Room> get allRooms => [
        Room(
          name: 'Degens After Dark',
          description: 'I heard someone\'s wallet got drained last night…',
          imageUrl: AppAssets.image1,
          memberCount: 24,
          reactions: 240,
          timeLeft: '1 hour left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'The Silent Witnesses',
          description: 'Which coin is pumping tonight?',
          imageUrl: AppAssets.image2,
          memberCount: 18,
          reactions: 156,
          timeLeft: '2 hours left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'The Chaos Room',
          description: 'New drop alert! Check this out...',
          imageUrl: AppAssets.image3,
          memberCount: 32,
          reactions: 89,
          timeLeft: '30 mins left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'Snake Pit',
          description: 'Yield farming strategies for 2024',
          imageUrl: AppAssets.image4,
          memberCount: 12,
          reactions: 67,
          timeLeft: '3 hours left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'Receipts & Rumors',
          description: 'HODL or fold? What\'s your strategy?',
          imageUrl: AppAssets.image5,
          memberCount: 45,
          reactions: 301,
          timeLeft: '45 mins left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'Trading Signals',
          description: 'Bull market incoming? Let\'s discuss',
          imageUrl: AppAssets.imag1,
          memberCount: 28,
          reactions: 178,
          timeLeft: '1 hour left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
      ];

  // User's rooms (same as in MyPage)
  List<Room> get userRooms => [
        Room(
          name: 'My Secret Room',
          description: 'Private discussions with close friends',
          imageUrl: AppAssets.image1,
          memberCount: 5,
          reactions: 45,
          timeLeft: '2 hours left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
        Room(
          name: 'Trading Signals',
          description: 'Bull market incoming? Let\'s discuss',
          imageUrl: AppAssets.imag1,
          memberCount: 28,
          reactions: 178,
          timeLeft: '1 hour left',
          memberAvatars: [AppAssets.image6, AppAssets.image7, AppAssets.image8],
        ),
      ];

  // Returns rooms based on selected tab
  List<Room> get rooms => selectedTabIndex == 0 ? allRooms : userRooms;

  void selectTab(int index) {
    selectedTabIndex = index;
    notifyListeners();
  }

  void selectFilter(int index) {
    selectedFilterIndex = selectedFilterIndex == index ? -1 : index;
    notifyListeners();
  }

  void selectNavItem(int index) {
    selectedNavIndex = index;
    notifyListeners();
  }

  void onRoomTap(Room room) {
    // Navigate to room details
  }

  void createRoom() {
    _navigationService.navigateToCreateroomView();
  }

  void onBackTap() {
    // Navigate back
  }

  void onSearchTap() {
    // Open search
  }

  void onFloatingActionButtonTap() {
    // Create new room
  }
}
