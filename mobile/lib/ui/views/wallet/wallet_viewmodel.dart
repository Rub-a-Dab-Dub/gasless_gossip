import 'package:mobile/app/app.locator.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class WalletViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  String _balance = '\$3,784.545';
  String _approximateBalance = '\$3,784.54';
  String _selectedToken = 'USDT';
  String _username = 'username.gaslessgossip.baseeth';
  String _walletAddress = '0xWI32....W893';

  bool _showCopySuccess = false;
  bool get showCopySuccess => _showCopySuccess;

  // Add this to control the bottom sheet visibility
  bool _showReceiveBottomSheet = false;
  bool get showReceiveBottomSheet => _showReceiveBottomSheet;

  String get balance => _balance;
  String get approximateBalance => _approximateBalance;
  String get selectedToken => _selectedToken;
  String get username => _username;
  String get walletAddress => _walletAddress;

  void onBackTap() {
    _navigationService.back();
  }

  void onReceiveTapped() {
    _showReceiveBottomSheet = true;
    rebuildUi();
  }

  void hideReceiveBottomSheet() {
    _showReceiveBottomSheet = false;
    rebuildUi();
  }

  void onSwapTapped() {
    print('Swap tapped');
  }

  void onSendTapped() {
    print('Send tapped');
  }

  void onCopyAddress() {
    print('Copy address tapped');
  }

  void onGetStartedFromHistory() {
    _showReceiveBottomSheet = true;
    rebuildUi();
  }

  void onTokenSelectorTapped() {
    print('Token selector tapped');
  }

  void onCopyAddressFromBottomSheet() {
    // Copy logic here
    print('Copy address tapped');

    // Show success message
    _showCopySuccess = true;
    rebuildUi();

    // Hide after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      _showCopySuccess = false;
      rebuildUi();
    });
  }
}
