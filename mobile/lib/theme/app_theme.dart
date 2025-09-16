import 'package:flutter/material.dart';

class AppTheme {
  AppTheme._();

  static const Color primary = Color(0xFF6A53A2);
  static const Color secondary = Color(0xFF8E7CC3);
  static const Color background = Color(0xFF0F0F13);
  static const Color surface = Color(0xFF1A1A1F);
  static const Color accent = Color(0xFFFFD700);
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);

  static const double radiusSmall = 8;
  static const double radiusMedium = 16;
  static const double radiusLarge = 24;

  static const Duration animFast = Duration(milliseconds: 150);
  static const Duration anim = Duration(milliseconds: 300);
  static const Duration animSlow = Duration(milliseconds: 600);

  static ThemeData get darkTheme {
    final ThemeData base = ThemeData.dark(useMaterial3: true);
    final ColorScheme scheme = base.colorScheme.copyWith(
      brightness: Brightness.dark,
      primary: primary,
      secondary: secondary,
      surface: surface,
      background: background,
      error: error,
    );

    final TextTheme textTheme = base.textTheme.copyWith(
      displayLarge: base.textTheme.displayLarge?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
      ),
      titleLarge: base.textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.w600,
      ),
      bodyMedium: base.textTheme.bodyMedium?.copyWith(
        height: 1.3,
      ),
      labelLarge: base.textTheme.labelLarge?.copyWith(
        fontWeight: FontWeight.w600,
      ),
    );

    return base.copyWith(
      colorScheme: scheme,
      scaffoldBackgroundColor: background,
      textTheme: textTheme,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          side: BorderSide(color: Colors.white.withOpacity(0.06)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: primary,
      ),
      iconTheme: const IconThemeData(color: Colors.white70),
      useMaterial3: true,
    );
  }

  static List<BoxShadow> get glowPurpleSoft => <BoxShadow>[
        BoxShadow(
          color: primary.withOpacity(0.35),
          blurRadius: 20,
          spreadRadius: 1,
          offset: const Offset(0, 6),
        ),
      ];

  static LinearGradient get gradientPrimary => const LinearGradient(
        colors: <Color>[primary, secondary],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );

  static LinearGradient get gradientGold => const LinearGradient(
        colors: <Color>[Color(0xFFFFE082), accent],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
}


