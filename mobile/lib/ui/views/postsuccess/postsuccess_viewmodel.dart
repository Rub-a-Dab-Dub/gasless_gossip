import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class PostsuccessViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  final int xpEarned;

  PostsuccessViewModel({required this.xpEarned});

  void onContinue() {
    // Navigate back to home (removes the success overlay)
    _navigationService.clearStackAndShow(Routes.bottomnavView);
  }

  void onShare() {
    // TODO: Implement share functionality
    print('Share post');
  }
}
