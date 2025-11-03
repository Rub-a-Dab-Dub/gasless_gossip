import 'package:mobile/app/app.locator.dart';
import 'package:mobile/app/app.router.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

enum TransactionType { receive, swap, send }

class Transaction {
  final String id;
  final TransactionType type;
  final String amount;
  final String hash;
  final String date;
  final String status;
  final List<TransactionType> icons; // Multiple icons for combined transactions

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.hash,
    required this.date,
    required this.status,
    required this.icons,
  });
}

class WalletViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  final String _balance = '\$3,784.545';
  final String _approximateBalance = '\$3,784.54';
  final String _selectedToken = 'USDT';
  final String _username = 'username.gaslessgossip.baseeth';
  final String _walletAddress = '0xWI32....W893';

  bool _showCopySuccess = false;
  bool get showCopySuccess => _showCopySuccess;

  // Add this to control the bottom sheet visibility
  bool _showReceiveBottomSheet = false;
  bool get showReceiveBottomSheet => _showReceiveBottomSheet;

  // Transaction history
  List<Transaction> _transactions = [];
  List<Transaction> get transactions => _transactions;
  bool get hasTransactions => _transactions.isNotEmpty;

  String get balance => _balance;
  String get approximateBalance => _approximateBalance;
  String get selectedToken => _selectedToken;
  String get username => _username;
  String get walletAddress => _walletAddress;

  WalletViewModel() {
    _initializeTransactions();
  }

  void _initializeTransactions() {
    _transactions = [
      Transaction(
        id: '1',
        type: TransactionType.receive,
        amount: 'Received \$30',
        hash: 'Transaction hash',
        date: '12/10/2025',
        status: 'Successful',
        icons: [
          TransactionType.receive,
          TransactionType.swap,
          TransactionType.send
        ],
      ),
      Transaction(
        id: '2',
        type: TransactionType.swap,
        amount: 'Swapped \$150',
        hash: 'Transaction hash',
        date: '12/10/2025',
        status: 'Successful',
        icons: [TransactionType.swap],
      ),
      Transaction(
        id: '3',
        type: TransactionType.send,
        amount: 'Sent \$500',
        hash: 'Transaction hash',
        date: '12/10/2025',
        status: 'Successful',
        icons: [TransactionType.send],
      ),
      Transaction(
        id: '4',
        type: TransactionType.receive,
        amount: 'Received \$200',
        hash: 'Transaction hash',
        date: '12/10/2025',
        status: 'Successful',
        icons: [
          TransactionType.receive,
          TransactionType.swap,
          TransactionType.send
        ],
      ),
    ];
  }

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
    _navigationService.navigateToSwapView();
  }

  void onSendTapped() {
    _navigationService.navigateToSendView();
  }

  void onCopyAddress() {
    // Copy address tapped
  }

  void onGetStartedFromHistory() {
    _showReceiveBottomSheet = true;
    rebuildUi();
  }

  void onTokenSelectorTapped() {
    // Token selector tapped
  }

  void onCopyAddressFromBottomSheet() {
    // Copy logic here
    // Copy address tapped

    // Show success message
    _showCopySuccess = true;
    rebuildUi();

    // Hide after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      _showCopySuccess = false;
      rebuildUi();
    });
  }

  void onQRCodeTapped() {
    // Hide bottom sheet first
    hideReceiveBottomSheet();

    // Navigate to receive scan view
    _navigationService.navigateToReceiveScanView();
  }
}
