import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart';
// The project includes stellar_wallet_flutter_sdk; we keep the import for future extensions.
// ignore: unused_import
import 'package:stellar_wallet_flutter_sdk/stellar_wallet_flutter_sdk.dart';

/// Represents lightweight wallet account information held by the app.
class WalletAccountInfo {
  final String accountId; // Public key (G...)
  final String secretKey; // Secret seed (S...)

  const WalletAccountInfo({required this.accountId, required this.secretKey});
}

/// Abstraction over secure key-value store for better testability.
abstract class SecureKeyValueStore {
  Future<void> write({required String key, required String value});
  Future<String?> read({required String key});
  Future<void> delete({required String key});
  Future<bool> containsKey({required String key});
}

/// FlutterSecureStorage-backed implementation with platform-specific options.
class FlutterSecureKeyValueStore implements SecureKeyValueStore {
  static const IOSOptions _iosOptions = IOSOptions(
    accessibility: KeychainAccessibility.first_unlock,
    synchronizable: false,
    accountName: 'whspr_stellar_wallet',
  );

  static const AndroidOptions _androidOptions = AndroidOptions(
    encryptedSharedPreferences: true,
    resetOnError: true,
    sharedPreferencesName: 'whspr_stellar_wallet',
  );

  final FlutterSecureStorage _storage;

  FlutterSecureKeyValueStore({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  @override
  Future<void> write({required String key, required String value}) async {
    await _storage.write(key: key, value: value, iOptions: _iosOptions, aOptions: _androidOptions);
  }

  @override
  Future<String?> read({required String key}) async {
    return _storage.read(key: key, iOptions: _iosOptions, aOptions: _androidOptions);
  }

  @override
  Future<void> delete({required String key}) async {
    await _storage.delete(key: key, iOptions: _iosOptions, aOptions: _androidOptions);
  }

  @override
  Future<bool> containsKey({required String key}) async {
    return (await _storage.containsKey(key: key, iOptions: _iosOptions, aOptions: _androidOptions));
  }
}

/// Simple gateway abstraction for Horizon to enable mocking in tests.
abstract class HorizonGateway {
  Future<AccountResponse> getAccount(String accountId);
}

class StellarHorizonGateway implements HorizonGateway {
  final StellarSDK _sdk;
  StellarHorizonGateway(this._sdk);

  @override
  Future<AccountResponse> getAccount(String accountId) {
    return _sdk.accounts.account(accountId);
  }
}

/// A service encapsulating wallet lifecycle, secure key management,
/// and basic Stellar Testnet operations.
class StellarWalletService {
  static const String _secretKeyStorageKey = 'stellar_secret_key_v1';

  final SecureKeyValueStore _secureStore;
  final HorizonGateway _horizon;

  String _networkPassphrase;
  String _horizonUrl;
  KeyPair? _activeKeyPair;

  /// Create a service instance.
  /// You may inject custom [secureStore], [horizonGateway], [horizonUrl], and [networkPassphrase]
  /// for testing. In production, defaults use Testnet Horizon and secure device storage.
  StellarWalletService({
    SecureKeyValueStore? secureStore,
    HorizonGateway? horizonGateway,
    String? horizonUrl,
    String? networkPassphrase,
  })  : _secureStore = secureStore ?? FlutterSecureKeyValueStore(),
        _horizonUrl = horizonUrl ?? 'https://horizon-testnet.stellar.org',
        _networkPassphrase = networkPassphrase ?? _defaultTestnetPassphrase(),
        _horizon = horizonGateway ?? StellarHorizonGateway(StellarSDK(horizonUrl ?? 'https://horizon-testnet.stellar.org'));

  /// Initialize the service using environment variables.
  /// It is safe to call multiple times; subsequent calls are ignored.
  Future<void> initializeWallet() async {
    try {
      // Load environment variables if not loaded yet.
      if (!dotenv.isInitialized) {
        // Default to ".env"; callers may provide their own file earlier in app startup.
        await dotenv.load(fileName: '.env');
      }
    } catch (_) {
      // If .env is missing in production builds, continue with defaults.
      debugPrint('dotenv not loaded; continuing with defaults');
    }

    // Apply env overrides if present.
    final envHorizon = dotenv.maybeGet('STELLAR_HORIZON_URL');
    final envNetwork = dotenv.maybeGet('STELLAR_NETWORK_PASSPHRASE');

    if (envHorizon != null && envHorizon.isNotEmpty) {
      _horizonUrl = envHorizon;
    }
    if (envNetwork != null && envNetwork.isNotEmpty) {
      _networkPassphrase = envNetwork;
    }

    debugPrint('StellarWalletService initialized (horizon=$_horizonUrl, network=$_networkPassphrase)');
  }

  /// Create a brand-new wallet (keypair) and store the secret key securely.
  /// Returns public and secret key info. Caller should treat secret with care.
  Future<WalletAccountInfo> createWallet() async {
    final KeyPair keyPair = KeyPair.random();
    final String publicKey = keyPair.accountId;
    final String secretSeed = keyPair.secretSeed;

    await _secureStore.write(key: _secretKeyStorageKey, value: secretSeed);

    _activeKeyPair = keyPair;
    return WalletAccountInfo(accountId: publicKey, secretKey: secretSeed);
  }

  /// Import an existing wallet from a Stellar secret seed (S...).
  /// Validates format and persists securely.
  Future<WalletAccountInfo> importWallet(String secretKey) async {
    final String trimmed = secretKey.trim();
    if (!_looksLikeSecretSeed(trimmed)) {
      throw ArgumentError('Invalid Stellar secret key format');
    }

    // Validate by attempting to construct a KeyPair
    final KeyPair keyPair;
    try {
      keyPair = KeyPair.fromSecretSeed(trimmed);
    } catch (e) {
      throw ArgumentError('Invalid Stellar secret key');
    }

    await _secureStore.write(key: _secretKeyStorageKey, value: trimmed);

    _activeKeyPair = keyPair;
    return WalletAccountInfo(accountId: keyPair.accountId, secretKey: trimmed);
  }

  /// Sign in using the wallet stored in secure storage, if present.
  /// Returns the wallet account info. Throws if not found.
  Future<WalletAccountInfo> signIn() async {
    final String? stored = await _secureStore.read(key: _secretKeyStorageKey);
    if (stored == null || stored.isEmpty) {
      throw StateError('No wallet found in secure storage');
    }

    final KeyPair keyPair = KeyPair.fromSecretSeed(stored);
    _activeKeyPair = keyPair;

    return WalletAccountInfo(accountId: keyPair.accountId, secretKey: stored);
  }

  /// Check if a wallet secret key is present in secure storage.
  Future<bool> isWalletStored() {
    return _secureStore.containsKey(key: _secretKeyStorageKey);
  }

  /// Sign out. If [clearStorage] is true, deletes the stored secret key.
  Future<void> signOut({bool clearStorage = false}) async {
    _activeKeyPair = null;
    if (clearStorage) {
      await _secureStore.delete(key: _secretKeyStorageKey);
    }
  }

  /// Query the total XLM balance for the given accountId on the configured network.
  /// Returns 0 if account has no native balance entry.
  Future<double> getAccountBalance(String accountId) async {
    try {
      final AccountResponse account = await _horizon.getAccount(accountId);
      Balance? native;
      for (final b in account.balances) {
        if (b.assetType == Asset.TYPE_NATIVE) {
          native = b;
          break;
        }
      }
      final String amountStr = (native?.balance) ?? '0';
      return double.tryParse(amountStr) ?? 0.0;
    } catch (e) {
      // Network or not found
      rethrow;
    }
  }

  // Removed buildServer; use StellarSDK externally if needed.

  /// Returns the currently active accountId, if signed in.
  String? get activeAccountId => _activeKeyPair?.accountId;

  /// Returns whether we have an active in-memory session.
  bool get isSignedIn => _activeKeyPair != null;

  bool _looksLikeSecretSeed(String s) {
    // S... base32, usually 56 chars
    return s.startsWith('S') && s.length >= 56;
  }

  /// Serialize basic service state for debugging.
  Map<String, dynamic> debugState() {
    return <String, dynamic>{
      'horizonUrl': _horizonUrl,
      'network': _networkPassphrase,
      'isSignedIn': isSignedIn,
      'activeAccountId': activeAccountId,
    };
  }
}

String _defaultTestnetPassphrase() {
  // Try to fetch from Network.TESTNET if available; otherwise fall back to the known constant.
  try {
    // ignore: deprecated_member_use, unnecessary_cast
    final dynamic n = Network.TESTNET as dynamic;
    // Some SDK versions expose networkPassphrase, others toString contains it.
    if (n is String) return n;
    final dynamic pass = n.networkPassphrase;
    if (pass is String) return pass;
    return n.toString();
  } catch (_) {
    return 'Test SDF Network ; September 2015';
  }
}
