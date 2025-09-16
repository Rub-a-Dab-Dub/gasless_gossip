import 'package:flutter/material.dart';

import '../models/room.dart';
import '../theme/app_theme.dart';
import 'common_widgets.dart';

class RoomCard extends StatelessWidget {
  final Room room;
  final VoidCallback? onTap;
  final bool showDetails;
  final bool compact;
  final double elevation;

  const RoomCard({
    super.key,
    required this.room,
    this.onTap,
    this.showDetails = true,
    this.compact = false,
    this.elevation = 0,
  });

  String get _roomEmoji {
    switch (room.type) {
      case RoomType.general:
        return '🏛️';
      case RoomType.private:
        return '🔒';
      case RoomType.secret:
        return '🕯️';
    }
  }

  @override
  Widget build(BuildContext context) {
    final TextStyle titleStyle = Theme.of(context).textTheme.titleLarge!.copyWith(fontWeight: FontWeight.w700);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
          border: Border.all(color: Colors.white.withOpacity(0.06)),
          boxShadow: <BoxShadow>[
            ...AppTheme.glowPurpleSoft,
            if (elevation > 0) BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: elevation, spreadRadius: 1),
          ],
          gradient: room.type == RoomType.secret
              ? LinearGradient(
                  colors: <Color>[
                    Colors.black.withOpacity(0.0),
                    Colors.purple.withOpacity(0.08),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null,
        ),
        padding: EdgeInsets.all(compact ? 12 : 16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Text(_roomEmoji, style: TextStyle(fontSize: compact ? 20 : 28)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Expanded(child: Text(room.name, style: titleStyle)),
                      const SizedBox(width: 8),
                      const StatusIndicator(),
                      const SizedBox(width: 6),
                      Text('${room.onlineCount}', style: const TextStyle(color: Colors.white70)),
                    ],
                  ),
                  if (showDetails) ...<Widget>[
                    const SizedBox(height: 6),
                    Text(_lastActivityLabel(room.lastActivity), style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 12),
            const Icon(Icons.chevron_right, color: Colors.white54),
          ],
        ),
      ),
    );
  }

  String _lastActivityLabel(DateTime? ts) {
    if (ts == null) return '—';
    final Duration d = DateTime.now().difference(ts);
    if (d.inMinutes < 1) return 'Just now';
    if (d.inMinutes < 60) return '${d.inMinutes}m ago';
    if (d.inHours < 24) return '${d.inHours}h ago';
    return '${d.inDays}d ago';
  }
}


