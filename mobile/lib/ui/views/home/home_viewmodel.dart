import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';

class HomeViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  int selectedTabIndex = 0;

  // controls the overlay with the two stacked buttons
  bool showCreateOptions = false;

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

  void createPost() {
    _navigationService.navigateToCreatepostView();
  }

  void onQuestTap() {
    print("Quest tapped");
  }
}
