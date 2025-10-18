import 'package:flutter/material.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class SignupViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  bool _showPassword = false;
  bool get showPassword => _showPassword;

  bool _allFilled = false;
  bool get allFilled => _allFilled;

  SignupViewModel() {
    usernameController.addListener(_checkIfAllFilled);
    passwordController.addListener(_checkIfAllFilled);
    confirmPasswordController.addListener(_checkIfAllFilled);
  }

  void _checkIfAllFilled() {
    final filled = usernameController.text.isNotEmpty &&
        passwordController.text.isNotEmpty &&
        confirmPasswordController.text.isNotEmpty;

    if (filled != _allFilled) {
      _allFilled = filled;
      notifyListeners();
    }
  }

  void togglePassword() {
    _showPassword = !_showPassword;
    notifyListeners();
  }

  // ✅ When all fields are filled and "CONTINUE" is pressed
  void getStarted() {
    if (!_allFilled) return;

    debugPrint("Username: ${usernameController.text}");
    debugPrint("Password: ${passwordController.text}");
    debugPrint("Confirm Password: ${confirmPasswordController.text}");

    // 🔥 Navigate to your main screen (replace with your route name)
    _navigationService.replaceWithSignupSuccessfulView();
    // or use:
    // _navigationService.navigateToBottomnavView();
  }

  @override
  void dispose() {
    confirmPasswordController.dispose();
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
