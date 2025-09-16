import 'dart:ui';
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class XPProgressBar extends StatefulWidget {
  final int currentXP;
  final int nextLevelXP;
  final int level;
  final double height;
  final bool showDetails;
  final Duration animationDuration;

  const XPProgressBar({
    super.key,
    required this.currentXP,
    required this.nextLevelXP,
    required this.level,
    this.height = 16,
    this.showDetails = true,
    this.animationDuration = const Duration(milliseconds: 800),
  });

  @override
  State<XPProgressBar> createState() => _XPProgressBarState();
}

class _XPProgressBarState extends State<XPProgressBar> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late Animation<double> _progressAnim;

  double get _progress => widget.nextLevelXP == 0
      ? 0
      : (widget.currentXP.clamp(0, widget.nextLevelXP)) / widget.nextLevelXP;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.animationDuration);
    _progressAnim = Tween<double>(begin: 0, end: _progress).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic));
    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant XPProgressBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentXP != widget.currentXP || oldWidget.nextLevelXP != widget.nextLevelXP) {
      _progressAnim = Tween<double>(begin: _progressAnim.value, end: _progress).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic));
      _controller
        ..duration = widget.animationDuration
        ..forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                gradient: AppTheme.gradientGold,
                borderRadius: BorderRadius.circular(999),
                boxShadow: AppTheme.glowPurpleSoft,
              ),
              child: Row(children: <Widget>[
                const Text('⭐', style: TextStyle(fontSize: 12)),
                const SizedBox(width: 6),
                Text('Lv ${widget.level}', style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w800)),
              ]),
            ),
            const SizedBox(width: 12),
            if (widget.showDetails)
              Text('${widget.currentXP}/${widget.nextLevelXP} XP', style: const TextStyle(color: Colors.white70, fontFeatures: <FontFeature>[FontFeature.tabularFigures()])),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: Container(
            height: widget.height,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.06),
            ),
            child: AnimatedBuilder(
              animation: _progressAnim,
              builder: (context, _) {
                return Stack(
                  fit: StackFit.expand,
                  children: <Widget>[
                    FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: _progressAnim.value.clamp(0.0, 1.0),
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: <Color>[
                              AppTheme.primary,
                              Color.lerp(AppTheme.primary, AppTheme.accent, _progressAnim.value)!,
                            ],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment((_progressAnim.value * 2) - 1, 0),
                      child: Container(
                        width: widget.height,
                        height: widget.height,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.15),
                          boxShadow: <BoxShadow>[
                            BoxShadow(color: AppTheme.accent.withOpacity(0.5), blurRadius: 12, spreadRadius: 1),
                          ],
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}


