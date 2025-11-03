import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';

class SignupSuccessfulViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  final int xpEarned = 30; // XP earned from signup

  void onGetStarted() {
    // Navigate to bottom nav (home)
    _navigationService.replaceWithBottomnavView();
  }

  void onShare() {
    // TODO: Implement share functionality
    // Share tapped
  }
}
