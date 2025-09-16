import 'package:flutter/foundation.dart';

import '../models/room.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';

class RoomProvider extends ChangeNotifier {
  final ApiService _apiService;
  final WebSocketService _wsService;

  List<Room> _rooms = <Room>[];
  Room? _currentRoom;
  final Map<String, List<ChatMessage>> _roomMessages = <String, List<ChatMessage>>{};
  bool _isLoading = false;
  String? _error;
  bool _isConnected = false;

  RoomProvider({ApiService? apiService, WebSocketService? webSocketService})
      : _apiService = apiService ?? ApiService(),
        _wsService = webSocketService ?? WebSocketService() {
    _wsService.onConnectionStateChanged.listen((state) {
      _isConnected = state == ConnectionStateWs.connected;
      notifyListeners();
    });
    _wsService.onMessage.listen(_handleWebSocketMessage);
  }

  List<Room> get rooms => List.unmodifiable(_rooms);
  Room? get currentRoom => _currentRoom;
  List<ChatMessage> get currentMessages => _currentRoom == null
      ? const <ChatMessage>[]
      : List.unmodifiable(_roomMessages[_currentRoom!.id] ?? const <ChatMessage>[]);
  bool get isLoading => _isLoading;
  bool get isConnected => _isConnected;
  String? get error => _error;

  Future<void> loadRooms() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      await _apiService.initialize();
      final List<Map<String, dynamic>> list = await _apiService.getRooms();
      _rooms = list
          .map((m) => Room.fromJson({
                'id': m['id'],
                'name': m['name'],
                'onlineCount': m['online'],
                'recentMessages': <Map<String, dynamic>>[],
                'createdAt': DateTime.now().toIso8601String(),
                'lastActivity': DateTime.now().toIso8601String(),
                'type': 'general',
              }))
          .toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> joinRoom(String roomId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final Map<String, dynamic> details = await _apiService.getRoomDetails(roomId);
      final Room room = Room.fromJson({
        'id': details['id'],
        'name': details['name'],
        'onlineCount': details['online'],
        'recentMessages': (details['recentMessages'] as List<dynamic>? ?? const [])
            .map((e) => {
                  'id': '${e['userId']}-${e['timestamp']}',
                  'userId': e['userId'],
                  'message': e['message'],
                  'timestamp': e['timestamp'],
                  'type': 'text',
                })
            .toList(),
        'createdAt': DateTime.now().toIso8601String(),
        'lastActivity': DateTime.now().toIso8601String(),
        'type': 'general',
      });
      _currentRoom = room;
      _roomMessages[room.id] = List<ChatMessage>.from(room.recentMessages);
      _wsService.subscribe('room:${room.id}');
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> leaveRoom() async {
    if (_currentRoom != null) {
      _wsService.unsubscribe('room:${_currentRoom!.id}');
    }
    _currentRoom = null;
    notifyListeners();
  }

  Future<void> sendMessage(String message) async {
    final room = _currentRoom;
    if (room == null) return;
    final ChatMessage msg = ChatMessage(
      id: 'local-${DateTime.now().millisecondsSinceEpoch}',
      userId: 'me',
      username: 'Me',
      message: message,
      timestamp: DateTime.now(),
      type: MessageType.text,
    );
    addMessage(msg);
    _wsService.sendMessage({'type': 'chat', 'roomId': room.id, 'message': message});
  }

  void addMessage(ChatMessage message) {
    final room = _currentRoom;
    if (room == null) return;
    final List<ChatMessage> list = List<ChatMessage>.from(_roomMessages[room.id] ?? const <ChatMessage>[]);
    list.add(message);
    list.sort((a, b) => a.timestamp.compareTo(b.timestamp));
    _roomMessages[room.id] = list;
    notifyListeners();
  }

  Future<void> loadRoomHistory(String roomId) async {
    try {
      final Map<String, List<ChatMessage>> snapshot = Map<String, List<ChatMessage>>.from(_roomMessages);
      _roomMessages[roomId] = snapshot[roomId] ?? <ChatMessage>[];
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void connectWebSocket() {
    _wsService.connect();
  }

  void disconnectWebSocket() {
    _wsService.disconnect();
  }

  void _handleWebSocketMessage(Map<String, dynamic> message) {
    final String? type = message['type'] as String?;
    if (type == 'chat') {
      final String roomId = message['roomId'] as String? ?? '';
      if (_currentRoom != null && _currentRoom!.id == roomId) {
        addMessage(ChatMessage.fromJson({
          'id': '${message['userId']}-${message['timestamp']}',
          'userId': message['userId'],
          'message': message['message'],
          'timestamp': message['timestamp'],
          'type': 'text',
        }));
      }
    }
  }
}


