import 'package:flutter_test/flutter_test.dart';

import 'package:whisper/providers/user_provider.dart';
import 'package:whisper/providers/room_provider.dart';
import 'package:whisper/providers/wallet_provider.dart';
import 'package:whisper/services/api_service.dart';
import 'package:whisper/services/websocket_service.dart';
import 'package:whisper/services/stellar_wallet_service.dart';

class _MockApiService extends ApiService {
  @override
  Future<Map<String, dynamic>> getUserXP(String userId) async {
    return {
      'userId': userId,
      'xp': 100,
      'level': 1,
      'nextLevelXp': 300,
      'history': [
        {'type': 'message', 'xp': 10, 'timestamp': DateTime.now().toIso8601String()},
      ],
    };
  }

  @override
  Future<List<Map<String, dynamic>>> getRooms() async {
    return [
      {'id': 'room-general', 'name': 'General', 'online': 2},
    ];
  }

  @override
  Future<Map<String, dynamic>> getRoomDetails(String roomId) async {
    return {
      'id': roomId,
      'name': 'GENERAL',
      'online': 2,
      'recentMessages': [
        {'userId': 'u1', 'message': 'Welcome!', 'timestamp': DateTime.now().toIso8601String()},
      ],
    };
  }
}

class _MockWebSocketService extends WebSocketService {
  @override
  void connect() {}
}

class _MockHorizon implements HorizonGateway {
  @override
  Future getAccount(String accountId) async {
    return Future.error('not implemented in mock');
  }
}

class _MockWallet extends StellarWalletService {
  _MockWallet()
      : super(
          secureStore: null,
          horizonGateway: _MockHorizon() as HorizonGateway,
        );

  @override
  Future<WalletAccountInfo> createWallet() async {
    return const WalletAccountInfo(accountId: 'GABC', secretKey: 'SABC');
  }

  @override
  Future<WalletAccountInfo> signIn() async {
    return const WalletAccountInfo(accountId: 'GABC', secretKey: 'SABC');
  }
}

void main() {
  test('UserProvider should load user data correctly', () async {
    final provider = UserProvider(apiService: _MockApiService());
    await provider.loadUser('u1');
    expect(provider.currentUser?.id, 'u1');
    expect(provider.currentUser?.xp, 100);
  });

  test('RoomProvider should manage room state', () async {
    final provider = RoomProvider(apiService: _MockApiService(), webSocketService: _MockWebSocketService());
    await provider.loadRooms();
    expect(provider.rooms.isNotEmpty, true);
    await provider.joinRoom('room-general');
    expect(provider.currentRoom?.id, 'room-general');
    expect(provider.currentMessages.isNotEmpty, true);
  });

  test('WalletProvider should manage wallet state', () async {
    final provider = WalletProvider(walletService: _MockWallet());
    await provider.createWallet();
    expect(provider.walletInfo?.accountId, 'GABC');
  });
}


