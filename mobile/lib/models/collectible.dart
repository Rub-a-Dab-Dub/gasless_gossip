import 'dart:convert';

enum CollectibleType { gift, achievement, badge, emoji, nft }
enum CollectibleRarity { common, rare, epic, legendary }
enum GiftStatus { sent, received, opened, expired }

class Collectible {
  final String id;
  final String name;
  final String? description;
  final CollectibleType type;
  final String? imageUrl;
  final CollectibleRarity rarity;
  final int? value;
  final DateTime? obtainedAt;
  final Map<String, dynamic>? attributes;

  const Collectible({
    required this.id,
    required this.name,
    this.description,
    required this.type,
    this.imageUrl,
    required this.rarity,
    this.value,
    this.obtainedAt,
    this.attributes,
  });

  Collectible copyWith({
    String? id,
    String? name,
    String? description,
    CollectibleType? type,
    String? imageUrl,
    CollectibleRarity? rarity,
    int? value,
    DateTime? obtainedAt,
    Map<String, dynamic>? attributes,
  }) {
    return Collectible(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      imageUrl: imageUrl ?? this.imageUrl,
      rarity: rarity ?? this.rarity,
      value: value ?? this.value,
      obtainedAt: obtainedAt ?? this.obtainedAt,
      attributes: attributes ?? this.attributes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'type': type.name,
      'imageUrl': imageUrl,
      'rarity': rarity.name,
      'value': value,
      'obtainedAt': obtainedAt?.toIso8601String(),
      'attributes': attributes,
    };
  }

  factory Collectible.fromJson(Map<String, dynamic> json) {
    return Collectible(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      type: _typeFrom(json['type']),
      imageUrl: json['imageUrl'],
      rarity: _rarityFrom(json['rarity']),
      value: json['value'] == null ? null : (json['value'] as num).toInt(),
      obtainedAt: _parseDate(json['obtainedAt']),
      attributes: json['attributes'] == null ? null : Map<String, dynamic>.from(json['attributes'] as Map),
    );
  }

  static CollectibleType _typeFrom(dynamic value) {
    if (value is String) {
      switch (value) {
        case 'gift':
          return CollectibleType.gift;
        case 'achievement':
          return CollectibleType.achievement;
        case 'badge':
          return CollectibleType.badge;
        case 'emoji':
          return CollectibleType.emoji;
        case 'nft':
          return CollectibleType.nft;
      }
    }
    return CollectibleType.gift;
  }

  static CollectibleRarity _rarityFrom(dynamic value) {
    if (value is String) {
      switch (value) {
        case 'common':
          return CollectibleRarity.common;
        case 'rare':
          return CollectibleRarity.rare;
        case 'epic':
          return CollectibleRarity.epic;
        case 'legendary':
          return CollectibleRarity.legendary;
      }
    }
    return CollectibleRarity.common;
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}

class Gift extends Collectible {
  final String fromUserId;
  final String toUserId;
  final DateTime sentAt;
  final GiftStatus status;
  final String? message;

  const Gift({
    required super.id,
    required super.name,
    super.description,
    super.type = CollectibleType.gift,
    super.imageUrl,
    super.rarity = CollectibleRarity.common,
    super.value,
    super.obtainedAt,
    super.attributes,
    required this.fromUserId,
    required this.toUserId,
    required this.sentAt,
    required this.status,
    this.message,
  });

  Gift copyWith({
    String? id,
    String? name,
    String? description,
    CollectibleType? type,
    String? imageUrl,
    CollectibleRarity? rarity,
    int? value,
    DateTime? obtainedAt,
    Map<String, dynamic>? attributes,
    String? fromUserId,
    String? toUserId,
    DateTime? sentAt,
    GiftStatus? status,
    String? message,
  }) {
    return Gift(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      imageUrl: imageUrl ?? this.imageUrl,
      rarity: rarity ?? this.rarity,
      value: value ?? this.value,
      obtainedAt: obtainedAt ?? this.obtainedAt,
      attributes: attributes ?? this.attributes,
      fromUserId: fromUserId ?? this.fromUserId,
      toUserId: toUserId ?? this.toUserId,
      sentAt: sentAt ?? this.sentAt,
      status: status ?? this.status,
      message: message ?? this.message,
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final base = super.toJson();
    return {
      ...base,
      'from': fromUserId,
      'to': toUserId,
      'sentAt': sentAt.toIso8601String(),
      'status': status.name,
      'message': message,
    };
  }

  factory Gift.fromJson(Map<String, dynamic> json) {
    return Gift(
      id: json['id'] ?? '${json['from'] ?? 'gift'}-${json['to'] ?? ''}-${json['timestamp'] ?? ''}',
      name: json['name'] ?? (json['gift'] ?? 'gift'),
      description: json['description'],
      type: CollectibleType.gift,
      imageUrl: json['imageUrl'],
      rarity: CollectibleRarity.common,
      value: null,
      obtainedAt: _parseDate(json['obtainedAt']),
      attributes: json['attributes'] == null ? null : Map<String, dynamic>.from(json['attributes'] as Map),
      fromUserId: json['from'] ?? '',
      toUserId: json['to'] ?? '',
      sentAt: _parseDate(json['sentAt'] ?? json['timestamp']) ?? DateTime.now(),
      status: _statusFrom(json['status']),
      message: json['message'],
    );
  }

  static GiftStatus _statusFrom(dynamic value) {
    if (value is String) {
      switch (value) {
        case 'sent':
          return GiftStatus.sent;
        case 'received':
          return GiftStatus.received;
        case 'opened':
          return GiftStatus.opened;
        case 'expired':
          return GiftStatus.expired;
      }
    }
    return GiftStatus.sent;
  }
}


