import 'dart:async';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart';

import 'package:mobile/services/stellar_wallet_service.dart';

class _MemoryStore implements SecureKeyValueStore {
  final Map<String, String> _data = <String, String>{};

  @override
  Future<bool> containsKey({required String key}) async => _data.containsKey(key);

  @override
  Future<void> delete({required String key}) async {
    _data.remove(key);
  }

  @override
  Future<String?> read({required String key}) async => _data[key];

  @override
  Future<void> write({required String key, required String value}) async {
    _data[key] = value;
  }
}

class _MockHorizon implements HorizonGateway {
  final Map<String, AccountResponse> accounts = <String, AccountResponse>{};
  Exception? nextError;

  @override
  Future<AccountResponse> getAccount(String accountId) async {
    if (nextError != null) {
      final Exception e = nextError!;
      nextError = null;
      throw e;
    }
    final AccountResponse? resp = accounts[accountId];
    if (resp == null) throw Exception('Account not found');
    return resp;
  }
}

AccountResponse _accountWithBalance(String accountId, String xlm) {
  return AccountResponse(
    accountId,
    0,
    [Balance(Asset.TYPE_NATIVE, xlm, null, null, null, null, null, null)],
    <String, dynamic>{},
    <String, dynamic>{},
    false,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('StellarWalletService', () {
    late _MemoryStore store;
    late _MockHorizon horizon;
    late StellarWalletService service;

    setUp(() async {
      store = _MemoryStore();
      horizon = _MockHorizon();
      service = StellarWalletService(
        secureStore: store,
        horizonGateway: horizon,
        horizonUrl: 'https://horizon-testnet.stellar.org',
        networkPassphrase: Network.TESTNET,
      );
    });

    test('should initialize wallet for testnet', () async {
      await service.initializeWallet();
      final state = service.debugState();
      expect(state['horizonUrl'], isNotEmpty);
      expect(state['network'], equals(Network.TESTNET));
      expect(state['isSignedIn'], isFalse);
    });

    test('should create new wallet and store keys securely', () async {
      final info = await service.createWallet();
      expect(info.accountId, startsWith('G'));
      expect(info.secretKey, startsWith('S'));
      expect(await service.isWalletStored(), isTrue);
      expect(service.isSignedIn, isTrue);
      expect(service.activeAccountId, equals(info.accountId));
    });

    test('should import wallet from valid secret key', () async {
      final kp = KeyPair.random();
      final imported = await service.importWallet(kp.secretSeed);
      expect(imported.accountId, equals(kp.accountId));
      expect(await service.isWalletStored(), isTrue);
      expect(service.isSignedIn, isTrue);
    });

    test('should handle invalid secret key gracefully', () async {
      expect(() => service.importWallet('invalid'), throwsArgumentError);
    });

    test('should sign in with stored wallet', () async {
      final created = await service.createWallet();
      await service.signOut(clearStorage: false);
      final signedIn = await service.signIn();
      expect(signedIn.accountId, equals(created.accountId));
      expect(service.isSignedIn, isTrue);
    });

    test('should sign out and clear wallet data', () async {
      await service.createWallet();
      await service.signOut(clearStorage: true);
      expect(service.isSignedIn, isFalse);
      expect(await service.isWalletStored(), isFalse);
    });

    test('should retrieve account balance from testnet', () async {
      final kp = KeyPair.random();
      horizon.accounts[kp.accountId] = _accountWithBalance(kp.accountId, '123.456');
      final balance = await service.getAccountBalance(kp.accountId);
      expect(balance, closeTo(123.456, 0.000001));
    });

    test('should propagate network errors for balance query', () async {
      final kp = KeyPair.random();
      horizon.nextError = Exception('network');
      expect(() => service.getAccountBalance(kp.accountId), throwsException);
    });

    test('should load env when available', () async {
      // Simulate loading .env; if not present, initializeWallet should still succeed.
      try {
        await dotenv.load(fileName: '.env');
      } catch (_) {}
      await service.initializeWallet();
      final state = service.debugState();
      expect(state['horizonUrl'], isNotNull);
    });
  });
}
