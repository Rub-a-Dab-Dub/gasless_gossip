import 'package:flutter/material.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class MyPageViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  // ===== State Management =====
  bool _isEditing = false;
  bool get isEditing => _isEditing;

  // ===== Profile Data (initial values) =====
  String username = "username";
  String about = "basically a certified talker";
  String email = "username@gmail.com";

  // ===== Text Controllers for Edit Mode =====
  final TextEditingController usernameController =
      TextEditingController(text: "username");
  final TextEditingController aboutController =
      TextEditingController(text: "basically a certified talker");
  final TextEditingController emailController =
      TextEditingController(text: "username@gmail.com");

  /// Toggle between view and edit
  void toggleEdit() {
    if (_isEditing) {
      // --- Save Mode ---
      username = usernameController.text.trim();
      about = aboutController.text.trim();
      email = emailController.text.trim();
    }

    _isEditing = !_isEditing;
    notifyListeners();
  }

  void onBackTap() {
    _navigationService.back();
  }

  @override
  void dispose() {
    usernameController.dispose();
    aboutController.dispose();
    emailController.dispose();
    super.dispose();
  }
}
