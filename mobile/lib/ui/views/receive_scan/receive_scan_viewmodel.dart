import 'package:flutter/services.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';

class ReceiveScanViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  // Sample data - replace with actual wallet data
  final String selectedToken = 'STRK';
  final String domainName = 'username.gaslessgossip.strk';
  final String accountAddress = '0x06429....g1n5';

  // QR code data
  String get qrCodeData => accountAddress;

  void onBack() {
    _navigationService.back();
  }

  void copyDomainName() {
    Clipboard.setData(ClipboardData(text: domainName));
    // TODO: Show snackbar/toast
    print('Domain name copied: $domainName');
  }

  void copyAccountAddress() {
    Clipboard.setData(ClipboardData(text: accountAddress));
    // TODO: Show snackbar/toast
    print('Account address copied: $accountAddress');
  }
}
