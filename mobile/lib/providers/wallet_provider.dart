import 'package:flutter/foundation.dart';

import '../services/stellar_wallet_service.dart';

class Transaction {
  final String id;
  final String type; // payment, gift
  final String? to;
  final String? from;
  final double amount;
  final DateTime timestamp;

  const Transaction({
    required this.id,
    required this.type,
    this.to,
    this.from,
    required this.amount,
    required this.timestamp,
  });
}

class WalletProvider extends ChangeNotifier {
  final StellarWalletService _walletService;

  WalletAccountInfo? _walletInfo;
  double _balance = 0.0;
  bool _isLoading = false;
  String? _error;
  bool _isInitialized = false;
  List<Transaction> _recentTransactions = <Transaction>[];

  WalletProvider({StellarWalletService? walletService}) : _walletService = walletService ?? StellarWalletService();

  WalletAccountInfo? get walletInfo => _walletInfo;
  String? get accountId => _walletInfo?.accountId;
  double get balance => _balance;
  bool get isSignedIn => _walletService.isSignedIn;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Transaction> get recentTransactions => List.unmodifiable(_recentTransactions);

  Future<void> initializeWallet() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      await _walletService.initializeWallet();
      _isInitialized = true;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createWallet() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _walletInfo = await _walletService.createWallet();
      await refreshBalance();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> importWallet(String secretKey) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _walletInfo = await _walletService.importWallet(secretKey);
      await refreshBalance();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signIn() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _walletInfo = await _walletService.signIn();
      await refreshBalance();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signOut({bool clearStorage = false}) async {
    await _walletService.signOut(clearStorage: clearStorage);
    _walletInfo = null;
    _balance = 0.0;
    notifyListeners();
  }

  Future<void> refreshBalance() async {
    final id = accountId;
    if (id == null) return;
    try {
      _balance = await _walletService.getAccountBalance(id);
    } catch (e) {
      _error = e.toString();
    } finally {
      notifyListeners();
    }
  }

  Future<bool> checkWalletExists() async {
    try {
      return await _walletService.isWalletStored();
    } catch (_) {
      return false;
    }
  }

  Future<void> sendPayment(String toAddress, double amount) async {
    // Placeholder: integrate with stellar_sdk operations builder in future
    final Transaction tx = Transaction(
      id: 'tx-${DateTime.now().millisecondsSinceEpoch}',
      type: 'payment',
      to: toAddress,
      from: accountId,
      amount: amount,
      timestamp: DateTime.now(),
    );
    _recentTransactions = <Transaction>[tx, ..._recentTransactions];
    notifyListeners();
  }

  Future<void> sendGift(String toUserId, String giftType) async {
    final Transaction tx = Transaction(
      id: 'gift-${DateTime.now().millisecondsSinceEpoch}',
      type: 'gift',
      to: toUserId,
      from: accountId,
      amount: 0,
      timestamp: DateTime.now(),
    );
    _recentTransactions = <Transaction>[tx, ..._recentTransactions];
    notifyListeners();
  }

  Future<void> loadTransactionHistory() async {
    // Placeholder for future Horizon history integration
    notifyListeners();
  }
}


