import 'package:stacked/stacked.dart';

// Models
class Quest {
  final String title;
  final int currentProgress;
  final int totalProgress;
  final int rewardXP;
  final bool isCompleted;

  Quest({
    required this.title,
    required this.currentProgress,
    required this.totalProgress,
    required this.rewardXP,
    this.isCompleted = false,
  });

  double get progressPercentage => currentProgress / totalProgress;
}

class DailyCheckIn {
  final int day;
  final bool isCompleted;
  final bool isToday;

  DailyCheckIn({
    required this.day,
    required this.isCompleted,
    required this.isToday,
  });
}

class TodayTask {
  final String title;
  final String description;
  final String imageUrl;
  final int rewardXP;
  final int currentProgress;
  final int totalProgress;
  final bool isCompleted;

  TodayTask({
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.rewardXP,
    required this.currentProgress,
    required this.totalProgress,
    this.isCompleted = false,
  });
}

class ReferralInfo {
  final String referralCode;
  final int currentReferrals;
  final int targetReferrals;
  final int rewardXP;

  ReferralInfo({
    required this.referralCode,
    required this.currentReferrals,
    required this.targetReferrals,
    required this.rewardXP,
  });
}

class QuestsViewModel extends BaseViewModel {
  int selectedTabIndex = 0; // My Stats is active
  int selectedNavIndex = 1; // Shield/Security is active
  int userLevel = 2;
  int currentXP = 120;
  double balance = 2.12; // in millions
  int levelProgress = 2; // 2/3 to next level
  int maxLevelProgress = 3;

  // ADD THIS: Leaderboard filter property
  String selectedFilter = 'Today';

  List<Quest> get quests => [
        Quest(
          title: 'Drop 10 whispers in a room',
          currentProgress: 4,
          totalProgress: 10,
          rewardXP: 30,
        ),
        Quest(
          title: 'Join 3 different rooms',
          currentProgress: 2,
          totalProgress: 3,
          rewardXP: 50,
        ),
        Quest(
          title: 'Get 100 reactions total',
          currentProgress: 67,
          totalProgress: 100,
          rewardXP: 75,
        ),
      ];

  List<DailyCheckIn> get dailyCheckIns => [
        DailyCheckIn(day: 1, isCompleted: true, isToday: true),
        DailyCheckIn(day: 2, isCompleted: false, isToday: false),
        DailyCheckIn(day: 3, isCompleted: false, isToday: false),
        DailyCheckIn(day: 4, isCompleted: false, isToday: false),
        DailyCheckIn(day: 5, isCompleted: false, isToday: false),
        DailyCheckIn(day: 6, isCompleted: false, isToday: false),
        DailyCheckIn(day: 7, isCompleted: false, isToday: false),
      ];

  List<TodayTask> get todayTasks => [
        TodayTask(
          title: 'Ad Break',
          description: 'Watch a promotional video',
          imageUrl: '3d-island-with-sea-landscape.jpg',
          rewardXP: 30,
          currentProgress: 0,
          totalProgress: 1,
        ),
        TodayTask(
          title: 'Ad Break',
          description: 'Watch a promotional video',
          imageUrl: '3d-island-with-sea-landscape.jpg',
          rewardXP: 30,
          currentProgress: 0,
          totalProgress: 1,
        ),
        TodayTask(
          title: 'Ad Break',
          description: 'Watch a promotional video',
          imageUrl: '3d-island-with-sea-landscape.jpg',
          rewardXP: 30,
          currentProgress: 0,
          totalProgress: 1,
        ),
      ];

  ReferralInfo get referralInfo => ReferralInfo(
        referralCode: 'gasless3284',
        currentReferrals: 1,
        targetReferrals: 10,
        rewardXP: 20,
      );

  void selectTab(int index) {
    selectedTabIndex = index;
    notifyListeners();
  }

  void selectNavItem(int index) {
    selectedNavIndex = index;
    notifyListeners();
  }

  // ADD THIS: Method to change leaderboard filter
  void setSelectedFilter(String filter) {
    selectedFilter = filter;
    notifyListeners();
  }

  void onQuestTap(Quest quest) {
    // Start or continue quest
  }

  void onBackTap() {
    // Navigate back
  }

  void onSettingsTap() {
    // Open settings
  }

  void onDailyCheckInTap(DailyCheckIn checkIn) {
    if (checkIn.isToday && !checkIn.isCompleted) {
      // Complete daily check-in
    }
  }
}
