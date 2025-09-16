import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/room_provider.dart';
import '../providers/user_provider.dart';
import '../providers/wallet_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/common_widgets.dart';
import '../widgets/gifting_hub.dart';
import '../widgets/room_card.dart';
import '../widgets/xp_progress_bar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Future<void>? _initialLoad;

  @override
  void initState() {
    super.initState();
    _initialLoad = _loadAll();
  }

  Future<void> _loadAll() async {
    final userProv = context.read<UserProvider>();
    final roomProv = context.read<RoomProvider>();
    final walletProv = context.read<WalletProvider>();
    await Future.wait(<Future<void>>[
      userProv.loadUser('me'),
      roomProv.loadRooms(),
      walletProv.initializeWallet(),
    ]);
    roomProv.connectWebSocket();
  }

  @override
  void dispose() {
    context.read<RoomProvider>().disconnectWebSocket();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userProv = context.watch<UserProvider>();
    final roomProv = context.watch<RoomProvider>();
    final walletProv = context.watch<WalletProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: <Widget>[
            const CircleAvatar(radius: 14, backgroundColor: Colors.white24, child: Text('🕵️')),
            const SizedBox(width: 8),
            const Text('Whisper'),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Row(children: <Widget>[
                const Icon(Icons.star, size: 14, color: AppTheme.accent),
                const SizedBox(width: 6),
                Text('Lv ${userProv.currentUser?.level ?? 1}', style: const TextStyle(fontWeight: FontWeight.w700)),
              ]),
            ),
            IconButton(icon: const Icon(Icons.settings_outlined), onPressed: () {}),
          ],
        ),
      ),
      body: RefreshIndicator(
        color: AppTheme.primary,
        onRefresh: () async {
          await Future.wait(<Future<void>>[
            if (userProv.currentUser != null) userProv.refreshUser() else userProv.loadUser('me'),
            roomProv.loadRooms(),
            walletProv.refreshBalance(),
          ]);
        },
        child: FutureBuilder<void>(
          future: _initialLoad,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }
            return ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                MysticalCard(
                  child: XPProgressBar(
                    currentXP: userProv.currentUser?.xp ?? 0,
                    nextLevelXP: userProv.currentUser?.nextLevelXp ?? 100,
                    level: userProv.currentUser?.level ?? 1,
                    height: 18,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: const <Widget>[
                    Text('Rooms', style: TextStyle(fontWeight: FontWeight.w700)),
                    Spacer(),
                  ],
                ),
                const SizedBox(height: 8),
                if (roomProv.isLoading)
                  ...List<Widget>.generate(3, (i) => const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: LoadingShimmer(width: double.infinity, height: 72)))
                else
                  ...roomProv.rooms.map((r) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: RoomCard(
                          room: r,
                          onTap: () async {
                            await roomProv.joinRoom(r.id);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Joined ${r.name}')));
                            }
                          },
                        ),
                      )),
                const SizedBox(height: 16),
                const GiftingHub(quickSend: true),
                const SizedBox(height: 100),
              ],
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          showModalBottomSheet(
            context: context,
            backgroundColor: AppTheme.surface,
            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
            builder: (_) => const Padding(padding: EdgeInsets.all(16), child: GiftingHub()),
          );
        },
        icon: const Icon(Icons.card_giftcard),
        label: const Text('Gift'),
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: AppTheme.surface,
        selectedIndex: 0,
        destinations: const <NavigationDestination>[
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.forum_outlined), selectedIcon: Icon(Icons.forum), label: 'Rooms'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}


