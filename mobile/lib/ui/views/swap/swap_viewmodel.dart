import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';

class SwapViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  String _fromAmount = '0';
  String _toAmount = '0';

  String get fromAmount => _fromAmount;
  String get toAmount => _toAmount;

  void onBackTap() {
    _navigationService.back();
  }

  void onMaxFromTap() {
    // Set the maximum available balance for the from token
    _fromAmount = '3000';
    _calculateToAmount();
    notifyListeners();
  }

  void _calculateToAmount() {
    // TODO: Implement actual swap calculation logic
    // This is a placeholder calculation
    if (_fromAmount.isNotEmpty && _fromAmount != '0') {
      double fromValue = double.tryParse(_fromAmount) ?? 0;
      // Example conversion rate (this should come from actual swap logic)
      _toAmount = (fromValue * 0.95).toStringAsFixed(2);
    } else {
      _toAmount = '0';
    }
  }

  void onSwapTap() {
    // Validate amounts
    if (_fromAmount.isEmpty || _fromAmount == '0') {
      // Show error - amount required
      return;
    }

    // Process the swap transaction
    // TODO: Implement actual swap logic
    // Swapping $_fromAmount to $_toAmount
  }
}
