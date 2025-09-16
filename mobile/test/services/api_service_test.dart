import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:whisper/services/api_service.dart';

void main() {
  group('HTTP Operations', () {
    setUp(() async {
      dotenv.testLoad(fileInput: 'API_URL=http://localhost:3001\nAPI_TIMEOUT=2000\nDEBUG_MODE=false');
    });

    test('loads env and health GET succeeds', () async {
      final client = MockClient((request) async => http.Response('{}', 200));
      final api = ApiService(httpClient: client);
      await api.initialize();
      final res = await api.checkApiHealth();
      expect(res, isA<Map<String, dynamic>>());
    });

    test('successful GET /health', () async {
      final client = MockClient((request) async {
        expect(request.url.toString(), 'http://localhost:3001/health');
        return http.Response('{"status":"ok"}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      final res = await api.checkApiHealth();
      expect(res['status'], 'ok');
    });

    test('handles HTTP 500', () async {
      final client = MockClient((request) async => http.Response('boom', 500));
      final api = ApiService(httpClient: client);
      await api.initialize();
      expect(() => api.get('/health'), throwsA(isA<ApiException>()));
    });

    test('POST/PUT/DELETE request paths with auth header', () async {
      final seen = <String>[];
      final client = MockClient((request) async {
        seen.add('${request.method} ${request.url.path}');
        expect(request.headers['Authorization'], isNotNull);
        return http.Response('{"ok":true}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      api.setAuthToken('token-123');
      await api.post('/gifts', body: {'id': 1});
      await api.put('/rooms/1', body: {'name': 'General'});
      await api.delete('/rooms/1');
      expect(seen, containsAllInOrder(['POST /gifts', 'PUT /rooms/1', 'DELETE /rooms/1']));
    });

    test('user XP and rooms mocks', () async {
      final api = ApiService(httpClient: MockClient((_) async => http.Response('{}', 200)));
      await api.initialize();
      final res = await api.getUserXP('user123');
      expect(res['userId'], 'user123');
      expect(res['xp'], isA<int>());
      final rooms = await api.getRooms();
      expect(rooms, isA<List>());
      expect(rooms.first, containsPair('id', 'room-general'));
    });

    test('timeout and retry logic', () async {
      final timeoutClient = MockClient((request) async {
        await Future.delayed(const Duration(milliseconds: 2100));
        return http.Response('{}', 200);
      });
      final apiTimeout = ApiService(httpClient: timeoutClient);
      await apiTimeout.initialize();
      apiTimeout.setMaxRetries(0);
      expect(() => apiTimeout.get('/health'), throwsA(isA<TimeoutExceptionApi>()));

      int count = 0;
      final retryClient = MockClient((request) async {
        count++;
        if (count < 2) return http.Response('server error', 500);
        return http.Response('{}', 200);
      });
      final apiRetry = ApiService(httpClient: retryClient);
      await apiRetry.initialize();
      final res = await apiRetry.get('/health');
      expect(res, isA<Map<String, dynamic>>());
      expect(count, 2);
    });

    test('JSON parsing error', () async {
      final client = MockClient((request) async => http.Response('not-json', 200));
      final api = ApiService(httpClient: client);
      await api.initialize();
      expect(() => api.get('/health'), throwsA(isA<JsonParsingException>()));
    });
  });

  group('WebSocket Operations', () {
    // High-level placeholder: ensure setup does not crash in test env when disabled.
    test('websocket configuration does not throw when disabled', () async {
      dotenv.testLoad(fileInput: 'API_URL=http://localhost:3001\nAPI_TIMEOUT=2000\nENABLE_WS=false');
      final api = ApiService();
      await api.initialize();
      expect(api.isWebSocketEnabled, anyOf(isNull, isFalse));
    });
  });
}


