import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:whisper/services/api_service.dart';
import 'package:whisper/services/websocket_service.dart';

Future<void> runApiAndWsDemo() async {
  await dotenv.load(fileName: '.env');

  final apiService = ApiService();
  final wsService = WebSocketService();

  await apiService.initialize();

  final health = await apiService.checkApiHealth();
  // ignore: avoid_print
  print('API Health: ${health['status']}');

  final userXP = await apiService.getUserXP('user123');
  final rooms = await apiService.getRooms();
  // ignore: avoid_print
  print('User XP: ${userXP['xp']}');
  // ignore: avoid_print
  print('Rooms: ${rooms.length}');

  await wsService.connect();
  wsService.onMessage.listen((message) {
    // ignore: avoid_print
    print('WS Received: $message');
  });

  wsService.sendMessage({
    'type': 'chat',
    'roomId': 'room123',
    'message': 'Hello, Whisper!',
  });

  // Emit some mock events locally
  wsService.emitMockChatMessage(roomId: 'room123', userId: 'user123', text: 'Hi!');
  wsService.emitMockXpGain(userId: 'user123', xp: 5);
  wsService.emitMockGift(fromUserId: 'user123', toUserId: 'user456', gift: 'rose');
}


