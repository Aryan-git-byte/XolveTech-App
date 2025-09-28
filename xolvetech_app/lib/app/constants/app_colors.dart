// Create: lib/app/constants/app_colors.dart
import 'package:flutter/material.dart';

class AppColors {
  // Primary Brand Colors - Blue Gradient
  static const Color primaryBlue900 = Color(0xFF1E3A8A);
  static const Color primaryBlue800 = Color(0xFF1E40AF);
  static const Color primaryBlue700 = Color(0xFF1D4ED8);
  static const Color primaryBlue600 = Color(0xFF2563EB);
  static const Color primaryBlue500 = Color(0xFF3B82F6);
  
  // Action Colors - Orange
  static const Color actionOrange600 = Color(0xFFEA580C);
  static const Color actionOrange500 = Color(0xFFF97316);
  static const Color actionOrange400 = Color(0xFFFB923C);
  static const Color actionOrange300 = Color(0xFFFDBA74);
  static const Color actionOrange200 = Color(0xFFFED7AA);
  
  // Success Colors - Green
  static const Color successGreen600 = Color(0xFF059669);
  static const Color successGreen500 = Color(0xFF10B981);
  static const Color successGreen400 = Color(0xFF34D399);
  static const Color successGreen300 = Color(0xFF6EE7B7);
  static const Color successGreen100 = Color(0xFFD1FAE5);
  
  // Premium Colors - Purple
  static const Color premiumPurple700 = Color(0xFF7C3AED);
  static const Color premiumPurple600 = Color(0xFF9333EA);
  static const Color premiumPurple500 = Color(0xFFA855F7);
  
  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);
  
  // Error & Warning
  static const Color error = Color(0xFFDC2626);
  static const Color warning = Color(0xFFF59E0B);
  
  // Background & Surface
  static const Color background = gray50;
  static const Color surface = white;
  static const Color surfaceVariant = gray100;
  
  // Text Colors
  static const Color textPrimary = gray900;
  static const Color textSecondary = gray600;
  static const Color textTertiary = gray500;
  static const Color textOnPrimary = white;
  static const Color textOnSurface = gray900;
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue900, primaryBlue600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient actionGradient = LinearGradient(
    colors: [actionOrange600, actionOrange400],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
