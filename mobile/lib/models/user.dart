import 'dart:convert';

import 'xp.dart';

class User {
  final String id;
  final String? username;
  final String? avatarUrl;
  final int xp;
  final int level;
  final int nextLevelXp;
  final List<XPHistoryEntry> xpHistory;
  final DateTime createdAt;
  final DateTime lastActive;

  const User({
    required this.id,
    this.username,
    this.avatarUrl,
    required this.xp,
    required this.level,
    required this.nextLevelXp,
    required this.xpHistory,
    required this.createdAt,
    required this.lastActive,
  });

  double get xpProgress => nextLevelXp <= 0 ? 0.0 : (xp / nextLevelXp).clamp(0.0, 1.0);

  double get levelProgress => XPCalculator.calculateProgress(xp, level);

  bool get isValid => id.isNotEmpty && xp >= 0 && level >= 0 && nextLevelXp >= 0;

  User copyWith({
    String? id,
    String? username,
    String? avatarUrl,
    int? xp,
    int? level,
    int? nextLevelXp,
    List<XPHistoryEntry>? xpHistory,
    DateTime? createdAt,
    DateTime? lastActive,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      nextLevelXp: nextLevelXp ?? this.nextLevelXp,
      xpHistory: xpHistory ?? this.xpHistory,
      createdAt: createdAt ?? this.createdAt,
      lastActive: lastActive ?? this.lastActive,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'avatarUrl': avatarUrl,
      'xp': xp,
      'level': level,
      'nextLevelXp': nextLevelXp,
      'xpHistory': xpHistory.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'lastActive': lastActive.toIso8601String(),
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['userId'] ?? '',
      username: json['username'],
      avatarUrl: json['avatarUrl'],
      xp: (json['xp'] ?? 0) as int,
      level: (json['level'] ?? 0) as int,
      nextLevelXp: (json['nextLevelXp'] ?? 0) as int,
      xpHistory: ((json['xpHistory'] ?? json['history']) as List<dynamic>? ?? const [])
          .map((e) => XPHistoryEntry.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
      createdAt: _parseDate(json['createdAt']) ?? DateTime.fromMillisecondsSinceEpoch(0),
      lastActive: _parseDate(json['lastActive']) ?? DateTime.now(),
    );
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }

  static User fromJsonString(String jsonString) => User.fromJson(json.decode(jsonString) as Map<String, dynamic>);

  String toJsonString() => json.encode(toJson());

  @override
  String toString() {
    return 'User(id: $id, username: $username, xp: $xp, level: $level, next: $nextLevelXp)';
  }
}


