import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';

class CreateroomViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  // Form fields
  String _nickname = '';
  String get nickname => _nickname;

  void updateNickname(String value) {
    _nickname = value;
    notifyListeners();
  }

  bool get isFormValid {
    return _nickname.isNotEmpty &&
        _selectedDurationIndex != -1 &&
        _selectedAccessIndex != -1;
  }

  // Duration selection
  int _selectedDurationIndex = -1; // No selection by default
  int get selectedDurationIndex => _selectedDurationIndex;

  void selectDuration(int index) {
    _selectedDurationIndex = index;
    notifyListeners();
  }

  // Access type selection
  int _selectedAccessIndex = -1; // "Open" selected by default
  int get selectedAccessIndex => _selectedAccessIndex;

  void selectAccess(int index) {
    _selectedAccessIndex = index;
    notifyListeners();
  }

  // Actions
  void goBack() {
    _navigationService.back();
  }

  void createRoom() {
    // Navigate to Upload Avatar page with room data
    _navigationService.navigateToUploadavatarView();
  }
}
