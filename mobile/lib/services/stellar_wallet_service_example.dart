import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:whisper/services/stellar_wallet_service.dart';

Future<void> runStellarWalletServiceDemo() async {
  final service = StellarWalletService();
  await _ensureEnvLoaded();
  await service.initializeWallet();

  debugPrint('Service state: ${service.debugState()}');

  // Create a new wallet
  final newWallet = await service.createWallet();
  debugPrint('New wallet created: ${newWallet.accountId}');

  // Sign out memory only, keep storage
  await service.signOut(clearStorage: false);

  // Sign back in from storage
  final wallet = await service.signIn();
  debugPrint('Signed in as: ${wallet.accountId}');

  // Query balance
  try {
    final balance = await service.getAccountBalance(wallet.accountId);
    debugPrint('Account balance: $balance XLM');
  } catch (e) {
    debugPrint('Failed to fetch balance: $e');
  }
}

Future<void> _ensureEnvLoaded() async {
  try {
    if (!dotenv.isInitialized) {
      await dotenv.load(fileName: '.env');
    }
  } catch (_) {
    // Ignore missing env in demo context
  }
}
