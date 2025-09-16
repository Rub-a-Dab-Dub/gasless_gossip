import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic details;

  ApiException(this.message, {this.statusCode, this.details});

  @override
  String toString() => 'ApiException(statusCode: $statusCode, message: $message, details: $details)';
}

class NetworkException extends ApiException {
  NetworkException(String message, {dynamic details}) : super(message, details: details);
}

class TimeoutExceptionApi extends ApiException {
  TimeoutExceptionApi(String message) : super(message);
}

class JsonParsingException extends ApiException {
  JsonParsingException(String message, {dynamic details}) : super(message, details: details);
}

class UnauthorizedException extends ApiException {
  UnauthorizedException(String message) : super(message, statusCode: 401);
}

class ApiServiceConfig {
  final String baseUrl;
  final Duration timeout;
  final bool debug;

  const ApiServiceConfig({
    required this.baseUrl,
    required this.timeout,
    required this.debug,
  });
}

class ApiService {
  final http.Client _httpClient;
  late ApiServiceConfig _config;
  String? _jwtToken;
  int _maxRetries = 2;

  ApiService({http.Client? httpClient}) : _httpClient = httpClient ?? http.Client();

  Future<void> initialize() async {
    // dotenv should be loaded in app startup; in case it's not, try load silently
    if (dotenv.isInitialized == false) {
      try {
        await dotenv.load(fileName: '.env');
      } catch (_) {}
    }

    final baseUrl = dotenv.maybeGet('API_URL') ?? 'http://localhost:3001';
    final timeoutMs = int.tryParse(dotenv.maybeGet('API_TIMEOUT') ?? '') ?? 10000;
    final debug = (dotenv.maybeGet('DEBUG_MODE') ?? 'false').toLowerCase() == 'true';
    _config = ApiServiceConfig(
      // remove trailing slashes
      baseUrl: baseUrl.replaceAll(RegExp(r'/+$'), ''),
      timeout: Duration(milliseconds: timeoutMs),
      debug: debug,
    );
  }

  void setAuthToken(String token) {
    _jwtToken = token;
  }

  void setMaxRetries(int retries) {
    _maxRetries = retries;
  }

  Map<String, String> _buildHeaders(Map<String, String>? headers) {
    final Map<String, String> merged = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...?headers,
    };
    if (_jwtToken != null && _jwtToken!.isNotEmpty) {
      merged['Authorization'] = 'Bearer $_jwtToken';
    }
    return merged;
  }

  Uri _buildUri(String endpoint) {
    final sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    return Uri.parse('${_config.baseUrl}$sanitizedEndpoint');
  }

  Future<Map<String, dynamic>> _decodeJson(http.Response response) async {
    try {
      if (response.body.isEmpty) return <String, dynamic>{};
      final dynamic decoded = json.decode(response.body);
      if (decoded is Map<String, dynamic>) return decoded;
      return {'data': decoded};
    } catch (e) {
      throw JsonParsingException('Failed to parse JSON', details: e.toString());
    }
  }

  Future<T> _withRetry<T>(Future<T> Function() action) async {
    int attempt = 0;
    while (true) {
      try {
        return await action();
      } on TimeoutException {
        attempt++;
        if (attempt > _maxRetries) {
          throw TimeoutExceptionApi('Request timed out after $_maxRetries retries');
        }
      } on NetworkException catch (_) {
        attempt++;
        if (attempt > _maxRetries) rethrow;
      } on ApiException catch (e) {
        if (e.statusCode != null && e.statusCode! >= 500) {
          attempt++;
          if (attempt > _maxRetries) rethrow;
        } else {
          rethrow;
        }
      }
      await Future.delayed(Duration(milliseconds: 300 * attempt));
    }
  }

  Future<Map<String, dynamic>> get(String endpoint, {Map<String, String>? headers}) async {
    return _withRetry(() async {
      final uri = _buildUri(endpoint);
      final requestHeaders = _buildHeaders(headers);
      _log('GET $uri');
      try {
        final response = await _httpClient
            .get(uri, headers: requestHeaders)
            .timeout(_config.timeout);
        return _handleResponse(response);
      } on TimeoutException {
        throw TimeoutExceptionApi('GET $endpoint timed out');
      } on http.ClientException catch (e) {
        throw NetworkException('Network error on GET $endpoint', details: e.message);
      }
    });
  }

  Future<Map<String, dynamic>> post(String endpoint, {dynamic body, Map<String, String>? headers}) async {
    return _withRetry(() async {
      final uri = _buildUri(endpoint);
      final requestHeaders = _buildHeaders(headers);
      final encodedBody = body == null ? null : json.encode(body);
      _log('POST $uri');
      try {
        final response = await _httpClient
            .post(uri, headers: requestHeaders, body: encodedBody)
            .timeout(_config.timeout);
        return _handleResponse(response);
      } on TimeoutException {
        throw TimeoutExceptionApi('POST $endpoint timed out');
      } on http.ClientException catch (e) {
        throw NetworkException('Network error on POST $endpoint', details: e.message);
      }
    });
  }

  Future<Map<String, dynamic>> put(String endpoint, {dynamic body, Map<String, String>? headers}) async {
    return _withRetry(() async {
      final uri = _buildUri(endpoint);
      final requestHeaders = _buildHeaders(headers);
      final encodedBody = body == null ? null : json.encode(body);
      _log('PUT $uri');
      try {
        final response = await _httpClient
            .put(uri, headers: requestHeaders, body: encodedBody)
            .timeout(_config.timeout);
        return _handleResponse(response);
      } on TimeoutException {
        throw TimeoutExceptionApi('PUT $endpoint timed out');
      } on http.ClientException catch (e) {
        throw NetworkException('Network error on PUT $endpoint', details: e.message);
      }
    });
  }

  Future<Map<String, dynamic>> delete(String endpoint, {Map<String, String>? headers}) async {
    return _withRetry(() async {
      final uri = _buildUri(endpoint);
      final requestHeaders = _buildHeaders(headers);
      _log('DELETE $uri');
      try {
        final response = await _httpClient
            .delete(uri, headers: requestHeaders)
            .timeout(_config.timeout);
        return _handleResponse(response);
      } on TimeoutException {
        throw TimeoutExceptionApi('DELETE $endpoint timed out');
      } on http.ClientException catch (e) {
        throw NetworkException('Network error on DELETE $endpoint', details: e.message);
      }
    });
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode == 401) {
      throw UnauthorizedException('Unauthorized');
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException('HTTP ${response.statusCode}', statusCode: response.statusCode, details: response.body);
    }
    return json.decode(response.body.isEmpty ? '{}' : response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> checkApiHealth() async {
    return get('/health');
  }

  Future<Map<String, dynamic>> checkDatabaseHealth() async {
    return get('/health/db');
  }

  Future<Map<String, dynamic>> getUserXP(String userId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return {
      'userId': userId,
      'xp': 1420,
      'level': 5,
      'nextLevelXp': 1600,
      'history': [
        {'type': 'message', 'xp': 10, 'timestamp': DateTime.now().subtract(const Duration(minutes: 5)).toIso8601String()},
        {'type': 'gift', 'xp': 50, 'timestamp': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String()},
      ],
    };
  }

  Future<List<Map<String, dynamic>>> getRooms() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return [
      {'id': 'room-general', 'name': 'General', 'online': 23},
      {'id': 'room-dev', 'name': 'Developers', 'online': 12},
      {'id': 'room-crypto', 'name': 'Crypto', 'online': 8},
    ];
  }

  Future<Map<String, dynamic>> getRoomDetails(String roomId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return {
      'id': roomId,
      'name': roomId.replaceAll('room-', '').toUpperCase(),
      'online': 10,
      'recentMessages': [
        {'userId': 'u1', 'message': 'Welcome!', 'timestamp': DateTime.now().subtract(const Duration(minutes: 1)).toIso8601String()},
      ],
    };
  }

  Future<Map<String, dynamic>> updateUserXP(String userId, int xpGain) async {
    await Future.delayed(const Duration(milliseconds: 150));
    return {'userId': userId, 'xpGained': xpGain, 'newXp': 1420 + xpGain};
  }

  Future<Map<String, dynamic>> sendGift(String fromUserId, String toUserId, String giftType) async {
    await Future.delayed(const Duration(milliseconds: 150));
    return {
      'from': fromUserId,
      'to': toUserId,
      'gift': giftType,
      'status': 'sent',
      'timestamp': DateTime.now().toIso8601String(),
    };
  }

  void _log(String message) {
    if ((_config.debug)) {
      debugPrint('[ApiService] $message');
    }
  }
}


