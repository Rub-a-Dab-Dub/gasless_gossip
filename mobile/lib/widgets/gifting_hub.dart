import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/wallet_provider.dart';
import '../theme/app_theme.dart';
import 'common_widgets.dart';
import 'gift_animation_widget.dart';

class GiftingHub extends StatelessWidget {
  final bool showInventory;
  final bool quickSend;
  final int maxColumns;
  final bool compactMode;

  const GiftingHub({
    super.key,
    this.showInventory = true,
    this.quickSend = false,
    this.maxColumns = 4,
    this.compactMode = false,
  });

  @override
  Widget build(BuildContext context) {
    final wallet = context.watch<WalletProvider>();
    final List<GiftType> gifts = <GiftType>[GiftType.common, GiftType.rare, GiftType.epic, GiftType.legendary];

    return MysticalCard(
      header: Row(
        children: <Widget>[
          const Text('Gifting Hub', style: TextStyle(fontWeight: FontWeight.w700)),
          const Spacer(),
          Row(children: <Widget>[
            const Icon(Icons.account_balance_wallet, size: 16, color: Colors.white70),
            const SizedBox(width: 6),
            Text('${wallet.balance.toStringAsFixed(2)} XLM', style: const TextStyle(color: Colors.white70)),
          ]),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: maxColumns,
              childAspectRatio: 1,
              crossAxisSpacing: compactMode ? 8 : 12,
              mainAxisSpacing: compactMode ? 8 : 12,
            ),
            itemCount: gifts.length,
            itemBuilder: (context, index) {
              final GiftType type = gifts[index];
              final String label = switch (type) {
                GiftType.common => 'Common',
                GiftType.rare => 'Rare',
                GiftType.epic => 'Epic',
                GiftType.legendary => 'Legendary',
              };
              final double cost = switch (type) {
                GiftType.common => 0.1,
                GiftType.rare => 0.5,
                GiftType.epic => 1.0,
                GiftType.legendary => 2.5,
              };
              return MysticalCard(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    GiftAnimationWidget(giftType: type, size: compactMode ? 54 : 64),
                    const SizedBox(height: 8),
                    Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('${cost.toStringAsFixed(2)} XLM', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 10),
                    GlowingButton(
                      label: quickSend ? 'Send' : 'Select',
                      onPressed: () async {
                        // Placeholder: in full flow, open recipient selector; here we simulate send
                        await context.read<WalletProvider>().sendGift('user-123', label.toLowerCase());
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$label gift sent!')));
                        }
                      },
                      variant: ButtonVariant.primary,
                      icon: Icons.card_giftcard,
                    ),
                  ],
                ),
              );
            },
          ),
          if (showInventory) ...<Widget>[
            const SizedBox(height: 16),
            const Text('Recent Gifts', style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            for (final tx in wallet.recentTransactions.where((t) => t.type == 'gift'))
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.card_giftcard, color: AppTheme.accent),
                title: Text('Sent ${tx.id}'),
                subtitle: Text('to ${tx.to ?? 'unknown'} • ${_formatTimeAgo(tx.timestamp)}'),
              ),
          ],
        ],
      ),
    );
  }

  String _formatTimeAgo(DateTime ts) {
    final Duration d = DateTime.now().difference(ts);
    if (d.inMinutes < 1) return 'just now';
    if (d.inMinutes < 60) return '${d.inMinutes}m ago';
    if (d.inHours < 24) return '${d.inHours}h ago';
    return '${d.inDays}d ago';
  }
}


