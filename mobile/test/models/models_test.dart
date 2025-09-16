import 'package:flutter_test/flutter_test.dart';

import 'package:whisper/models/user.dart';
import 'package:whisper/models/xp.dart';
import 'package:whisper/models/room.dart';
import 'package:whisper/models/collectible.dart';

void main() {
  group('User model', () {
    test('should serialize and deserialize correctly', () {
      final user = User(
        id: 'u1',
        username: 'alice',
        avatarUrl: 'https://example.com/a.png',
        xp: 120,
        level: 2,
        nextLevelXp: 300,
        xpHistory: <XPHistoryEntry>[
          XPHistoryEntry(type: 'message', xp: 10, timestamp: DateTime.now()),
        ],
        createdAt: DateTime.fromMillisecondsSinceEpoch(0),
        lastActive: DateTime.now(),
      );
      final json = user.toJson();
      final parsed = User.fromJson(json);
      expect(parsed.id, 'u1');
      expect(parsed.username, 'alice');
      expect(parsed.level, 2);
      expect(parsed.xpHistory.length, 1);
    });

    test('should calculate level progress accurately', () {
      final user = User(
        id: 'u2',
        xp: 150,
        level: 2,
        nextLevelXp: 300,
        xpHistory: const <XPHistoryEntry>[],
        createdAt: DateTime.fromMillisecondsSinceEpoch(0),
        lastActive: DateTime.now(),
      );
      expect(user.levelProgress, greaterThan(0));
      expect(user.levelProgress, lessThanOrEqualTo(1));
    });
  });

  group('XP models', () {
    test('XPHistoryEntry serialization', () {
      final entry = XPHistoryEntry(type: 'gift', xp: 50, timestamp: DateTime.now());
      final json = entry.toJson();
      final parsed = XPHistoryEntry.fromJson(json);
      expect(parsed.type, 'gift');
      expect(parsed.xp, 50);
    });

    test('XPCalculator functions', () {
      expect(XPCalculator.calculateLevel(0), 0);
      expect(XPCalculator.calculateLevel(120), greaterThanOrEqualTo(1));
      final next = XPCalculator.calculateNextLevelXp(2);
      expect(next, greaterThan(0));
      final progress = XPCalculator.calculateProgress(150, 2);
      expect(progress, inInclusiveRange(0.0, 1.0));
    });
  });

  group('Room models', () {
    test('Room and ChatMessage serialization', () {
      final msg = ChatMessage(
        id: 'm1',
        userId: 'u1',
        message: 'hello',
        timestamp: DateTime.now(),
        type: MessageType.text,
      );
      final room = Room(
        id: 'r1',
        name: 'General',
        onlineCount: 5,
        recentMessages: <ChatMessage>[msg],
        createdAt: DateTime.fromMillisecondsSinceEpoch(0),
        lastActivity: DateTime.now(),
        type: RoomType.general,
      );
      final json = room.toJson();
      final parsed = Room.fromJson(json);
      expect(parsed.id, 'r1');
      expect(parsed.recentMessages.first.message, 'hello');
    });
  });

  group('Collectible models', () {
    test('Gift serialization and status', () {
      final gift = Gift(
        id: 'g1',
        name: 'Rose',
        fromUserId: 'u1',
        toUserId: 'u2',
        sentAt: DateTime.now(),
        status: GiftStatus.sent,
      );
      final json = gift.toJson();
      final parsed = Gift.fromJson(json);
      expect(parsed.fromUserId, 'u1');
      expect(parsed.status, GiftStatus.sent);
    });
  });
}


