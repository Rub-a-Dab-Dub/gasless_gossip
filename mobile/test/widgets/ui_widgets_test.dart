import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:whisper/providers/room_provider.dart';
import 'package:whisper/providers/user_provider.dart';
import 'package:whisper/providers/wallet_provider.dart';
import 'package:whisper/screens/home_screen.dart';
import 'package:whisper/theme/app_theme.dart';
import 'package:whisper/widgets/xp_progress_bar.dart';
import 'package:whisper/widgets/room_card.dart';
import 'package:whisper/widgets/gift_animation_widget.dart';

void main() {
  Widget _wrapWithProviders(Widget child) {
    return MultiProvider(
      providers: <ChangeNotifierProvider<dynamic>>[
        ChangeNotifierProvider<UserProvider>(create: (_) => UserProvider()),
        ChangeNotifierProvider<RoomProvider>(create: (_) => RoomProvider()),
        ChangeNotifierProvider<WalletProvider>(create: (_) => WalletProvider()),
      ],
      child: MaterialApp(theme: AppTheme.darkTheme, home: child),
    );
  }

  testWidgets('XPProgressBar renders and animates', (tester) async {
    await tester.pumpWidget(MaterialApp(theme: AppTheme.darkTheme, home: const Scaffold(body: XPProgressBar(currentXP: 50, nextLevelXP: 100, level: 2))));
    expect(find.textContaining('Lv'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 900));
  });

  testWidgets('RoomCard shows room info', (tester) async {
    final room = RoomProvider().rooms; // empty by default; just mount a placeholder card via minimal Room
    await tester.pumpWidget(MaterialApp(
      theme: AppTheme.darkTheme,
      home: Scaffold(
        body: RoomCard(
          room: const Room(
            id: '1',
            name: 'General',
            onlineCount: 5,
            recentMessages: <ChatMessage>[],
            createdAt: DateTime.now(),
            lastActivity: DateTime.now(),
            type: RoomType.general,
          ),
        ),
      ),
    ));
    expect(find.text('General'), findsOneWidget);
  });

  testWidgets('GiftAnimationWidget builds', (tester) async {
    await tester.pumpWidget(MaterialApp(theme: AppTheme.darkTheme, home: const Scaffold(body: Center(child: GiftAnimationWidget()))));
    expect(find.byType(GiftAnimationWidget), findsOneWidget);
  });

  testWidgets('HomeScreen mounts with providers', (tester) async {
    await tester.pumpWidget(_wrapWithProviders(const HomeScreen()));
    expect(find.text('Whisper'), findsOneWidget);
  });
}


