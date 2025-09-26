import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';

class PersonalChatFundingViewModel extends BaseViewModel {
  final TextEditingController amountController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController messageController = TextEditingController();

  String? _amountError;
  String? get amountError => _amountError;

  String? _addressError;
  String? get addressError => _addressError;

  void onAmountChanged(String value) {
    _amountError = null;
    if (value.isNotEmpty) {
      final amount = double.tryParse(value.replaceFirst('\$', ''));
      if (amount == null) {
        _amountError = 'Invalid amount';
      } else if (amount <= 0) {
        _amountError = 'Amount must be positive';
      }
    }
    rebuildUi();
  }

  void onAddressChanged(String value) {
    _addressError = null;
    if (value.isNotEmpty) {
      // Basic Stellar address validation (starts with 'G' and is 56 chars long)
      if (!value.startsWith('G') || value.length != 56) {
        _addressError = 'Invalid Stellar address';
      }
    }
    rebuildUi();
  }

  void onMessageChanged(String value) {
    // No validation needed for the message
    rebuildUi();
  }

  bool validateForm() {
    bool isValid = true;
    if (amountController.text.isEmpty) {
      _amountError = 'Amount is required';
      isValid = false;
    } else {
      onAmountChanged(amountController.text);
      if (_amountError != null) isValid = false;
    }

    if (addressController.text.isEmpty) {
      _addressError = 'Recipient address is required';
      isValid = false;
    } else {
      onAddressChanged(addressController.text);
      if (_addressError != null) isValid = false;
    }
    
    rebuildUi();
    return isValid;
  }

  void sendFunds() {
    if (validateForm()) {
      setBusy(true);
      // Phase 3: Integration with StellarService will happen here
      // For now, just simulate a delay
      Future.delayed(const Duration(seconds: 2), () {
        setBusy(false);
        // Maybe show a success message or navigate back
      });
    }
  }

  @override
  void dispose() {
    amountController.dispose();
    addressController.dispose();
    messageController.dispose();
    super.dispose();
  }
}
