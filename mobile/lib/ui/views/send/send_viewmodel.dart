import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';

class SendViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  final TextEditingController nicknameController = TextEditingController();
  final TextEditingController amountController = TextEditingController();

  @override
  void dispose() {
    nicknameController.dispose();
    amountController.dispose();
    super.dispose();
  }

  void onBackTap() {
    _navigationService.back();
  }

  void onMaxTap() {
    // Set the maximum available balance
    amountController.text = '3000';
    notifyListeners();
  }

  void onSendTap() {
    // Validate inputs
    if (nicknameController.text.isEmpty) {
      // Show error - nickname required
      return;
    }

    if (amountController.text.isEmpty) {
      // Show error - amount required
      return;
    }

    // Process the send transaction
    // TODO: Implement actual send logic
    // Sending ${amountController.text} to ${nicknameController.text}
  }
}
