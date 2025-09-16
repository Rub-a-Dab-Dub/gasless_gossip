import 'dart:convert';

class XPHistoryEntry {
  final String type;
  final int xp;
  final DateTime timestamp;
  final String? description;
  final Map<String, dynamic>? metadata;

  const XPHistoryEntry({
    required this.type,
    required this.xp,
    required this.timestamp,
    this.description,
    this.metadata,
  });

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'xp': xp,
      'timestamp': timestamp.toIso8601String(),
      'description': description,
      'metadata': metadata,
    };
  }

  factory XPHistoryEntry.fromJson(Map<String, dynamic> json) {
    final int xpVal = (json['xp'] ?? 0) as int;
    if (xpVal < 0) {
      throw ArgumentError('XP value cannot be negative');
    }
    return XPHistoryEntry(
      type: json['type'] ?? 'unknown',
      xp: xpVal,
      timestamp: _parseDate(json['timestamp']) ?? DateTime.now(),
      description: json['description'],
      metadata: json['metadata'] == null ? null : Map<String, dynamic>.from(json['metadata'] as Map),
    );
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }

  static XPHistoryEntry fromJsonString(String jsonString) => XPHistoryEntry.fromJson(json.decode(jsonString) as Map<String, dynamic>);
  String toJsonString() => json.encode(toJson());
}

class XPCalculator {
  static const List<int> _thresholds = <int>[0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

  static int calculateLevel(int xp) {
    if (xp < 0) return 0;
    int level = 0;
    for (int i = 0; i < _thresholds.length; i++) {
      if (xp >= _thresholds[i]) level = i;
    }
    return level;
  }

  static int calculateNextLevelXp(int level) {
    if (level < 0) return _thresholds[1];
    if (level + 1 < _thresholds.length) return _thresholds[level + 1];
    // After last defined threshold, use a simple progression (increment by 1k per level)
    return _thresholds.last + (level - (_thresholds.length - 1) + 1) * 1000;
  }

  static double calculateProgress(int currentXp, int currentLevel) {
    if (currentXp <= 0) return 0.0;
    final int currentLevelThreshold = _thresholds.elementAt(currentLevel.clamp(0, _thresholds.length - 1));
    final int nextLevelThreshold = calculateNextLevelXp(currentLevel);
    final int span = (nextLevelThreshold - currentLevelThreshold).clamp(1, 1 << 30);
    final int intoLevel = (currentXp - currentLevelThreshold).clamp(0, span);
    return (intoLevel / span).clamp(0.0, 1.0);
  }

  static List<int> getLevelThresholds() => List<int>.from(_thresholds);
}


