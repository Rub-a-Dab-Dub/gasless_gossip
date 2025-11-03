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

class NFT {
  final String name;
  final String imageUrl;
  final String collection;
  final String price;

  NFT({
    required this.name,
    required this.imageUrl,
    required this.collection,
    required this.price,
  });
}

class Token {
  final String name;
  final String symbol;
  final String balance;
  final String value;
  final String change;
  final bool isPositive;

  Token({
    required this.name,
    required this.symbol,
    required this.balance,
    required this.value,
    required this.change,
    required this.isPositive,
  });
}

class ProfileViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  // Mock data - in real app this would come from a service
  bool _hasUserPosts = false;
  int _userPostCount = 0;
  int _totalXP = 120;

  bool get hasUserPosts => _hasUserPosts;
  int get userPostCount => _userPostCount;
  int get totalXP => _totalXP;

  // Selected tab in the content section (Posts, Rooms, NFTs, Tokens)
  int _selectedContentTab = 0;
  int get selectedContentTab => _selectedContentTab;

  // User's rooms (subset of all rooms)
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

  // User's NFTs
  List<NFT> get userNFTs => [
        NFT(
          name: 'Cosmic Warrior #1234',
          imageUrl: AppAssets.nft1,
          collection: 'Cosmic Warriors',
          price: '2.5 ETH',
        ),
        NFT(
          name: 'Digital Punk #5678',
          imageUrl: AppAssets.nft2,
          collection: 'Digital Punks',
          price: '1.8 ETH',
        ),
        NFT(
          name: 'Abstract Art #9012',
          imageUrl: AppAssets.nft3,
          collection: 'Abstract Collection',
          price: '0.9 ETH',
        ),
        NFT(
          name: 'Pixel Beast #3456',
          imageUrl: AppAssets.nft4,
          collection: 'Pixel Beasts',
          price: '3.2 ETH',
        ),
      ];

  void selectContentTab(int index) {
    _selectedContentTab = index;
    notifyListeners();
  }

  // Mock method to simulate user creating their first post
  void simulateUserPost() {
    _hasUserPosts = true;
    _userPostCount = 1;
    _totalXP += 12; // XP gained from posting
    notifyListeners();
  }

  // Quest actions
  void onQuestTap(String questTitle) {
    // Quest tapped: $questTitle
  }

  // Get started action for empty state
  void createNewPost() {
    // Get started tapped - navigate to create post
    // In real app, this would navigate to create post
  }

  void onWalletTap() {
    _navigationService.navigateToWalletView();
  }

  void onEditProfile() {
    _navigationService.navigateToMyPageView();
  }
}
