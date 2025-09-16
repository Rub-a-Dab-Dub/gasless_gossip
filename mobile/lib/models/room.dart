import 'dart:convert';

enum RoomType { general, private, secret }
enum MessageType { text, gift, system, xpGain }

class ChatMessage {
  final String id;
  final String userId;
  final String? username;
  final String message;
  final DateTime timestamp;
  final MessageType type;
  final Map<String, dynamic>? metadata;

  const ChatMessage({
    required this.id,
    required this.userId,
    this.username,
    required this.message,
    required this.timestamp,
    required this.type,
    this.metadata,
  });

  ChatMessage copyWith({
    String? id,
    String? userId,
    String? username,
    String? message,
    DateTime? timestamp,
    MessageType? type,
    Map<String, dynamic>? metadata,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      username: username ?? this.username,
      message: message ?? this.message,
      timestamp: timestamp ?? this.timestamp,
      type: type ?? this.type,
      metadata: metadata ?? this.metadata,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'username': username,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'type': type.name,
      'metadata': metadata,
    };
  }

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] ?? '${json['userId'] ?? 'u'}-${json['timestamp'] ?? DateTime.now().millisecondsSinceEpoch}',
      userId: json['userId'] ?? '',
      username: json['username'],
      message: json['message'] ?? '',
      timestamp: _parseDate(json['timestamp']) ?? DateTime.now(),
      type: _messageTypeFrom(json['type']),
      metadata: json['metadata'] == null ? null : Map<String, dynamic>.from(json['metadata'] as Map),
    );
  }

  static MessageType _messageTypeFrom(dynamic value) {
    if (value is String) {
      switch (value) {
        case 'text':
          return MessageType.text;
        case 'gift':
          return MessageType.gift;
        case 'system':
          return MessageType.system;
        case 'xpGain':
        case 'xp_gain':
        case 'xp':
          return MessageType.xpGain;
      }
    }
    return MessageType.text;
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}

class Room {
  final String id;
  final String name;
  final String? description;
  final int onlineCount;
  final List<ChatMessage> recentMessages;
  final DateTime createdAt;
  final DateTime lastActivity;
  final RoomType type;

  const Room({
    required this.id,
    required this.name,
    this.description,
    required this.onlineCount,
    required this.recentMessages,
    required this.createdAt,
    required this.lastActivity,
    required this.type,
  });

  Room copyWith({
    String? id,
    String? name,
    String? description,
    int? onlineCount,
    List<ChatMessage>? recentMessages,
    DateTime? createdAt,
    DateTime? lastActivity,
    RoomType? type,
  }) {
    return Room(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      onlineCount: onlineCount ?? this.onlineCount,
      recentMessages: recentMessages ?? this.recentMessages,
      createdAt: createdAt ?? this.createdAt,
      lastActivity: lastActivity ?? this.lastActivity,
      type: type ?? this.type,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'onlineCount': onlineCount,
      'recentMessages': recentMessages.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'lastActivity': lastActivity.toIso8601String(),
      'type': type.name,
    };
  }

  factory Room.fromJson(Map<String, dynamic> json) {
    return Room(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      onlineCount: (json['onlineCount'] ?? json['online'] ?? 0) as int,
      recentMessages: ((json['recentMessages']) as List<dynamic>? ?? const [])
          .map((e) => ChatMessage.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
      createdAt: _parseDate(json['createdAt']) ?? DateTime.fromMillisecondsSinceEpoch(0),
      lastActivity: _parseDate(json['lastActivity']) ?? DateTime.now(),
      type: _roomTypeFrom(json['type']),
    );
  }

  static RoomType _roomTypeFrom(dynamic value) {
    if (value is String) {
      switch (value) {
        case 'general':
          return RoomType.general;
        case 'private':
          return RoomType.private;
        case 'secret':
          return RoomType.secret;
      }
    }
    return RoomType.general;
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}


