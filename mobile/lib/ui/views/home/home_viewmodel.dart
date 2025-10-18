import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';

class HomeViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  int selectedTabIndex = 0;

  // controls the overlay with the two stacked buttons
  bool showCreateOptions = false;

  // controls the success modal overlay
  bool showSuccessModal = false;
  int xpEarned = 100; // XP earned from the post

  void selectTab(int i) {
    selectedTabIndex = i;
    notifyListeners();
  }

  void toggleCreateOptions() {
    showCreateOptions = !showCreateOptions;
    notifyListeners();
  }

  // actions
  void createRoom() {
    _navigationService.navigateToCreateroomView();
  }

  Future<void> createPost() async {
    final result = await _navigationService.navigateToCreatepostView();

    // Check if post was created successfully
    if (result != null && result is Map && result['showSuccess'] == true) {
      final xp = result['xp'] as int? ?? 100;
      showPostSuccessModal(xp);
    }
  }

  void onQuestTap() {
    print("Quest tapped");
  }

  void onViewAllQuests() {
    _navigationService.navigateToQuestsView();
  }

  // Show success modal after post creation
  void showPostSuccessModal(int xp) {
    xpEarned = xp;
    showSuccessModal = true;
    notifyListeners();
  }

  void hideSuccessModal() {
    showSuccessModal = false;
    notifyListeners();
  }

  void onContinueAfterSuccess() {
    hideSuccessModal();
    // Optionally refresh feed or do other actions
  }

  void onShareSuccess() {
    // Handle share action
  }
}
