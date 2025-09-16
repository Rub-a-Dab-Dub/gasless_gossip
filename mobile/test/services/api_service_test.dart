import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:whisper/services/api_service.dart';

void main() {
  group('ApiService', () {
    setUp(() async {
      dotenv.testLoad(fileInput: 'API_URL=http://localhost:3001\nAPI_TIMEOUT=2000\nDEBUG_MODE=false');
    });

    test('should load environment variables correctly', () async {
      final client = MockClient((request) async => http.Response('{}', 200));
      final api = ApiService(httpClient: client);
      await api.initialize();
      final res = await api.checkApiHealth();
      expect(res, isA<Map<String, dynamic>>());
    });

    test('should make successful GET request to health endpoint', () async {
      final client = MockClient((request) async {
        expect(request.url.toString(), 'http://localhost:3001/health');
        return http.Response('{"status":"ok"}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      final res = await api.checkApiHealth();
      expect(res['status'], 'ok');
    });

    test('should handle HTTP errors gracefully', () async {
      final client = MockClient((request) async => http.Response('boom', 500));
      final api = ApiService(httpClient: client);
      await api.initialize();
      expect(() => api.get('/health'), throwsA(isA<ApiException>()));
    });

    test('should return mock user XP data', () async {
      final api = ApiService(httpClient: MockClient((_) async => http.Response('{}', 200)));
      await api.initialize();
      final res = await api.getUserXP('user123');
      expect(res['userId'], 'user123');
      expect(res['xp'], isA<int>());
    });

    test('should return mock room list', () async {
      final api = ApiService(httpClient: MockClient((_) async => http.Response('{}', 200)));
      await api.initialize();
      final rooms = await api.getRooms();
      expect(rooms, isA<List>());
      expect(rooms.first, containsPair('id', 'room-general'));
    });

    test('should handle network timeout', () async {
      final client = MockClient((request) async {
        await Future.delayed(const Duration(milliseconds: 2100));
        return http.Response('{}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      api.setMaxRetries(0);
      expect(() => api.get('/health'), throwsA(isA<TimeoutExceptionApi>()));
    });

    test('should retry failed requests', () async {
      int count = 0;
      final client = MockClient((request) async {
        count++;
        if (count < 2) {
          return http.Response('server error', 500);
        }
        return http.Response('{}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      final res = await api.get('/health');
      expect(res, isA<Map<String, dynamic>>());
      expect(count, 2);
    });

    test('should add authentication headers when token provided', () async {
      final client = MockClient((request) async {
        expect(request.headers['Authorization'], isNotNull);
        expect(request.headers['Authorization']!.startsWith('Bearer '), isTrue);
        return http.Response('{}', 200);
      });
      final api = ApiService(httpClient: client);
      await api.initialize();
      api.setAuthToken('token-123');
      await api.get('/health');
    });

    test('should handle JSON parsing error', () async {
      final client = MockClient((request) async => http.Response('not-json', 200));
      final api = ApiService(httpClient: client);
      await api.initialize();
      expect(() => api.get('/health'), throwsA(isA<JsonParsingException>()));
    });
  });
}


