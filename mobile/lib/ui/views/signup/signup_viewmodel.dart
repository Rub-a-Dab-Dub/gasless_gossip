import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';

class SignupViewModel extends BaseViewModel {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  bool _showPassword = false;
  bool get showPassword => _showPassword;

  void togglePassword() {
    _showPassword = !_showPassword;
    notifyListeners();
  }

  void getStarted() {
    // Your sign-up or onboarding logic here
    debugPrint("Username: ${usernameController.text}");
    debugPrint("Password: ${passwordController.text}");
    debugPrint("Nickname: ${confirmPasswordController.text}");
  }

  @override
  void dispose() {
    confirmPasswordController.dispose();
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
