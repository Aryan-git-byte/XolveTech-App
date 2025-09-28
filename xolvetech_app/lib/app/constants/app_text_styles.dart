// Create: lib/app/constants/app_text_styles.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  static const String fontFamily = 'Inter';
  
  // Display Styles
  static const TextStyle display4xl = TextStyle(
    fontFamily: fontFamily,
    fontSize: 56,
    fontWeight: FontWeight.w700,
    height: 1.1,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle display3xl = TextStyle(
    fontFamily: fontFamily,
    fontSize: 48,
    fontWeight: FontWeight.w700,
    height: 1.2,
    color: AppColors.textPrimary,
  );
  
  // Heading Styles
  static const TextStyle heading2xl = TextStyle(
    fontFamily: fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 1.25,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headingXl = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.33,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headingLg = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headingMd = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.44,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headingSm = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: AppColors.textPrimary,
  );
  
  // Body Text Styles
  static const TextStyle bodyLg = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w400,
    height: 1.56,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle bodyMd = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle bodySm = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.43,
    color: AppColors.textPrimary,
  );
  
  // Button Text Styles
  static const TextStyle buttonLg = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: AppColors.textOnPrimary,
  );
  
  static const TextStyle buttonMd = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.43,
    color: AppColors.textOnPrimary,
  );
}
