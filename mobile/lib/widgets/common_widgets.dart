import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

enum ButtonVariant { primary, secondary, accent }

class GlowingButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final ButtonVariant variant;
  final IconData? icon;

  const GlowingButton({
    super.key,
    required this.label,
    this.onPressed,
    this.loading = false,
    this.variant = ButtonVariant.primary,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDisabled = onPressed == null || loading;
    final Gradient gradient = switch (variant) {
      ButtonVariant.primary => AppTheme.gradientPrimary,
      ButtonVariant.secondary => const LinearGradient(
          colors: <Color>[Color(0xFF3A2F63), Color(0xFF4E4478)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ButtonVariant.accent => AppTheme.gradientGold,
    };

    return AnimatedOpacity(
      duration: AppTheme.anim,
      opacity: isDisabled ? 0.6 : 1,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
          boxShadow: isDisabled ? null : AppTheme.glowPurpleSoft,
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
          onTap: isDisabled ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                if (loading)
                  const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black87),
                  )
                else if (icon != null)
                  Icon(icon, size: 18, color: Colors.black87),
                if (loading || icon != null) const SizedBox(width: 8),
                Flexible(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.black87,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class MysticalCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final Widget? header;
  final Widget? footer;

  const MysticalCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.header,
    this.footer,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
        boxShadow: AppTheme.glowPurpleSoft,
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          if (header != null) Padding(padding: const EdgeInsets.all(12), child: header),
          Padding(padding: padding, child: child),
          if (footer != null) Padding(padding: const EdgeInsets.all(12), child: footer),
        ],
      ),
    );
  }
}

class StatusIndicator extends StatefulWidget {
  final Color color;
  final double size;
  const StatusIndicator({super.key, this.color = AppTheme.success, this.size = 10});

  @override
  State<StatusIndicator> createState() => _StatusIndicatorState();
}

class _StatusIndicatorState extends State<StatusIndicator> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: AppTheme.animSlow)..repeat(reverse: true);
    _pulse = Tween<double>(begin: 0.6, end: 1.0).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _pulse,
      child: Container(
        width: widget.size,
        height: widget.size,
        decoration: BoxDecoration(
          color: widget.color,
          shape: BoxShape.circle,
          boxShadow: <BoxShadow>[
            BoxShadow(color: widget.color.withOpacity(0.6), blurRadius: 8, spreadRadius: 1),
          ],
        ),
      ),
    );
  }
}

class LoadingShimmer extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadius borderRadius;
  const LoadingShimmer({super.key, required this.width, required this.height, this.borderRadius = const BorderRadius.all(Radius.circular(12))});

  @override
  State<LoadingShimmer> createState() => _LoadingShimmerState();
}

class _LoadingShimmerState extends State<LoadingShimmer> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius,
            gradient: LinearGradient(
              colors: <Color>[
                Colors.white.withOpacity(0.06),
                Colors.white.withOpacity(0.12),
                Colors.white.withOpacity(0.06),
              ],
              stops: <double>[
                0.0,
                (_controller.value * 0.6) + 0.2,
                1.0,
              ],
              begin: Alignment(-1.0 + _controller.value * 2, 0.0),
              end: Alignment(1.0 + _controller.value * 2, 0.0),
            ),
          ),
        );
      },
    );
  }
}

class NotificationBadge extends StatelessWidget {
  final int count;
  final Color color;
  final double size;
  const NotificationBadge({super.key, required this.count, this.color = AppTheme.error, this.size = 16});

  @override
  Widget build(BuildContext context) {
    if (count <= 0) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(999)),
      child: Text('$count', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
    );
  }
}

class GradientText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final Gradient gradient;
  const GradientText(this.text, {super.key, this.style, this.gradient = const LinearGradient(colors: <Color>[AppTheme.primary, AppTheme.secondary])});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => gradient.createShader(Rect.fromLTWH(0, 0, bounds.width, bounds.height)),
      child: Text(text, style: (style ?? const TextStyle()).copyWith(color: Colors.white)),
    );
  }
}


