// lib/presentation/screens/auth/login_screen.dart
import 'package:flutter/material.dart';
import '../../../app/constants/app_colors.dart';
import '../../../app/constants/app_strings.dart';
import '../../../app/constants/app_text_styles.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: const SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  AppStrings.appName,
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    fontFamily: AppTextStyles.fontFamily,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  AppStrings.appTagline,
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 18,
                    fontFamily: AppTextStyles.fontFamily,
                  ),
                ),
                SizedBox(height: 48),
                Text(
                  'Login Screen - Ready!',
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 16,
                    fontFamily: AppTextStyles.fontFamily,
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