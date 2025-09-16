import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
// ignore: depend_on_referenced_packages
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/status.dart' as ws_status;

enum ConnectionStateWs { connecting, connected, disconnected, error }

class WebSocketService {
  final Duration _baseBackoff = const Duration(milliseconds: 500);
  final Duration _maxBackoff = const Duration(seconds: 10);
  final int _maxReconnectAttempts;

  final StreamController<Map<String, dynamic>> _messageController = StreamController.broadcast();
  final StreamController<ConnectionStateWs> _stateController = StreamController.broadcast();
  final StreamController<Object> _errorController = StreamController.broadcast();

  WebSocketChannel? _channel;
  String? _jwtToken;
  String? _wsUrl;
  bool _manuallyClosed = false;
  int _attempt = 0;
  Set<String> _subscriptions = <String>{};

  WebSocketService({int maxReconnectAttempts = 10}) : _maxReconnectAttempts = maxReconnectAttempts;

  Stream<Map<String, dynamic>> get onMessage => _messageController.stream;
  Stream<ConnectionStateWs> get onConnectionStateChanged => _stateController.stream;
  Stream<Object> get onError => _errorController.stream;

  void setAuthToken(String token) {
    _jwtToken = token;
  }

  Future<void> connect() async {
    if (dotenv.isInitialized == false) {
      try {
        await dotenv.load(fileName: '.env');
      } catch (_) {}
    }
    _wsUrl = dotenv.maybeGet('WS_URL') ?? 'ws://localhost:3001';
    await _openChannel();
  }

  Future<void> _openChannel() async {
    if (_wsUrl == null) throw StateError('WS URL not configured');
    _stateController.add(ConnectionStateWs.connecting);
    _manuallyClosed = false;
    try {
      final uri = Uri.parse(_wsUrl!);
      final headers = <String, dynamic>{};
      if (_jwtToken != null && _jwtToken!.isNotEmpty) {
        headers['Authorization'] = 'Bearer $_jwtToken';
      }
      if (kIsWeb) {
        _channel = WebSocketChannel.connect(uri);
      } else {
        _channel = IOWebSocketChannel.connect(uri, headers: headers);
      }
      _attempt = 0;
      _stateController.add(ConnectionStateWs.connected);
      _listen();
      // Resubscribe channels after reconnect
      for (final channel in _subscriptions) {
        sendMessage({'type': 'subscribe', 'channel': channel});
      }
    } catch (e) {
      _stateController.add(ConnectionStateWs.error);
      _errorController.add(e);
      _scheduleReconnect();
    }
  }

  void _listen() {
    _channel?.stream.listen((dynamic data) {
      try {
        final dynamic decoded = (data is String) ? json.decode(data) : data;
        if (decoded is Map<String, dynamic>) {
          _messageController.add(decoded);
          _routeMessage(decoded);
        }
      } catch (e) {
        _errorController.add(e);
      }
    }, onError: (Object error) {
      _stateController.add(ConnectionStateWs.error);
      _errorController.add(error);
      _scheduleReconnect();
    }, onDone: () {
      _stateController.add(ConnectionStateWs.disconnected);
      if (!_manuallyClosed) {
        _scheduleReconnect();
      }
    });
  }

  void _scheduleReconnect() {
    if (_manuallyClosed) return;
    if (_attempt >= _maxReconnectAttempts) return;
    _attempt++;
    final backoffMs = (_baseBackoff.inMilliseconds * (1 << (_attempt - 1))).clamp(_baseBackoff.inMilliseconds, _maxBackoff.inMilliseconds);
    _log('Reconnecting in ${backoffMs}ms (attempt: $_attempt)');
    Future.delayed(Duration(milliseconds: backoffMs), () {
      _openChannel();
    });
  }

  Future<void> disconnect() async {
    _manuallyClosed = true;
    try {
      await _channel?.sink.close(ws_status.normalClosure);
    } catch (_) {}
    _channel = null;
    _stateController.add(ConnectionStateWs.disconnected);
  }

  void sendMessage(Map<String, dynamic> message) {
    if (_channel == null) {
      throw StateError('WebSocket not connected');
    }
    try {
      _channel!.sink.add(json.encode(message));
    } catch (e) {
      _errorController.add(e);
    }
  }

  void subscribe(String channel) {
    _subscriptions.add(channel);
    sendMessage({'type': 'subscribe', 'channel': channel});
  }

  void unsubscribe(String channel) {
    _subscriptions.remove(channel);
    sendMessage({'type': 'unsubscribe', 'channel': channel});
  }

  void _routeMessage(Map<String, dynamic> message) {
    // Basic routing hook for consumers; extend as needed
    // Example: handle ping/pong
    final type = message['type'];
    if (type == 'ping') {
      sendMessage({'type': 'pong'});
    }
  }

  // Mock helpers to emit events during early development / tests
  void emitMockChatMessage({required String roomId, required String userId, required String text}) {
    final msg = {
      'type': 'chat',
      'roomId': roomId,
      'userId': userId,
      'message': text,
      'timestamp': DateTime.now().toIso8601String(),
    };
    _messageController.add(msg);
  }

  void emitMockXpGain({required String userId, required int xp}) {
    final msg = {
      'type': 'xp_update',
      'userId': userId,
      'xp': xp,
      'timestamp': DateTime.now().toIso8601String(),
    };
    _messageController.add(msg);
  }

  void emitMockGift({required String fromUserId, required String toUserId, required String gift}) {
    final msg = {
      'type': 'gift',
      'from': fromUserId,
      'to': toUserId,
      'gift': gift,
      'timestamp': DateTime.now().toIso8601String(),
    };
    _messageController.add(msg);
  }

  void dispose() {
    _messageController.close();
    _stateController.close();
    _errorController.close();
    _channel?.sink.close();
  }

  void _log(String message) {
    final debug = (dotenv.maybeGet('DEBUG_MODE') ?? 'false').toLowerCase() == 'true';
    if (debug) {
      debugPrint('[WebSocketService] $message');
    }
  }
}


