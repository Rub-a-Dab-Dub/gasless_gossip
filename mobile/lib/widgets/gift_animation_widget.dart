import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

enum GiftType { common, rare, epic, legendary }

class GiftAnimationWidget extends StatefulWidget {
  final GiftType giftType;
  final double size;
  final bool autoPlay;
  final VoidCallback? onTap;
  final bool showParticles;

  const GiftAnimationWidget({
    super.key,
    this.giftType = GiftType.common,
    this.size = 80,
    this.autoPlay = true,
    this.onTap,
    this.showParticles = true,
  });

  @override
  State<GiftAnimationWidget> createState() => _GiftAnimationWidgetState();
}

class _GiftAnimationWidgetState extends State<GiftAnimationWidget> with TickerProviderStateMixin {
  late final AnimationController _sparkleCtrl;
  late final AnimationController _pulseCtrl;
  late final AnimationController _scaleCtrl;
  late final AnimationController _rotationCtrl;
  late final AnimationController _confettiCtrl;

  @override
  void initState() {
    super.initState();
    _sparkleCtrl = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
    _pulseCtrl = AnimationController(vsync: this, duration: AppTheme.animSlow)..repeat(reverse: true);
    _scaleCtrl = AnimationController(vsync: this, duration: AppTheme.anim);
    _rotationCtrl = AnimationController(vsync: this, duration: const Duration(seconds: 8))..repeat();
    _confettiCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    if (widget.autoPlay) {
      _scaleCtrl.forward();
    }
  }

  @override
  void dispose() {
    _sparkleCtrl.dispose();
    _pulseCtrl.dispose();
    _scaleCtrl.dispose();
    _rotationCtrl.dispose();
    _confettiCtrl.dispose();
    super.dispose();
  }

  Color get _giftColor => switch (widget.giftType) {
        GiftType.common => AppTheme.secondary,
        GiftType.rare => const Color(0xFF64B5F6),
        GiftType.epic => const Color(0xFFBA68C8),
        GiftType.legendary => AppTheme.accent,
      };

  String get _emoji => switch (widget.giftType) {
        GiftType.common => '🎁',
        GiftType.rare => '✨',
        GiftType.epic => '💎',
        GiftType.legendary => '👑',
      };

  Future<void> _playConfetti() async {
    await _confettiCtrl.forward(from: 0);
  }

  @override
  Widget build(BuildContext context) {
    final double size = widget.size;
    return GestureDetector(
      onTap: () async {
        await _playConfetti();
        widget.onTap?.call();
      },
      child: SizedBox(
        width: size,
        height: size,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            if (widget.showParticles)
              AnimatedBuilder(
                animation: _sparkleCtrl,
                builder: (context, _) => CustomPaint(
                  size: Size.square(size),
                  painter: _SparklePainter(progress: _sparkleCtrl.value, color: _giftColor),
                ),
              ),
            ScaleTransition(
              scale: Tween<double>(begin: 0.95, end: 1.0).animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut)),
              child: RotationTransition(
                turns: _rotationCtrl.drive(Tween<double>(begin: -0.005, end: 0.005)),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: <Color>[Colors.black.withOpacity(0.2), _giftColor.withOpacity(0.2)]),
                    shape: BoxShape.circle,
                    boxShadow: <BoxShadow>[
                      BoxShadow(color: _giftColor.withOpacity(0.5), blurRadius: 20, spreadRadius: 1),
                    ],
                  ),
                  child: Center(
                    child: Text(_emoji, style: TextStyle(fontSize: size * 0.5)),
                  ),
                ),
              ),
            ),
            AnimatedBuilder(
              animation: _confettiCtrl,
              builder: (context, _) => CustomPaint(
                size: Size.square(size),
                painter: _ConfettiPainter(progress: _confettiCtrl.value, baseColor: _giftColor),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SparklePainter extends CustomPainter {
  final double progress;
  final Color color;
  _SparklePainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color.withOpacity(0.6)
      ..style = PaintingStyle.fill;
    final Offset center = size.center(Offset.zero);
    const int particles = 24;
    final double radius = size.width * 0.42;
    for (int i = 0; i < particles; i++) {
      final double angle = (i / particles) * 2 * math.pi + progress * 2 * math.pi;
      final Offset pos = center + Offset(math.cos(angle), math.sin(angle)) * radius;
      final double r = (1 + math.sin(angle * 3 + progress * 6)) * 1.2 + 1.2;
      canvas.drawCircle(pos, r, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _SparklePainter oldDelegate) => oldDelegate.progress != progress || oldDelegate.color != color;
}

class _ConfettiPainter extends CustomPainter {
  final double progress;
  final Color baseColor;
  _ConfettiPainter({required this.progress, required this.baseColor});

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;
    final math.Random rng = math.Random(42);
    final Paint paint = Paint();
    final Offset center = size.center(Offset.zero);
    final int pieces = 60;
    for (int i = 0; i < pieces; i++) {
      final double angle = (i / pieces) * 2 * math.pi + rng.nextDouble() * 0.2;
      final double dist = Curves.easeOut.transform(progress) * (size.width * 0.5 + rng.nextDouble() * 10);
      final Offset pos = center + Offset(math.cos(angle), math.sin(angle)) * dist;
      paint.color = Color.lerp(baseColor, Colors.white, rng.nextDouble() * 0.6)!.withOpacity(1 - progress);
      canvas.drawCircle(pos, 2 + rng.nextDouble() * 2, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) => oldDelegate.progress != progress || oldDelegate.baseColor != baseColor;
}


