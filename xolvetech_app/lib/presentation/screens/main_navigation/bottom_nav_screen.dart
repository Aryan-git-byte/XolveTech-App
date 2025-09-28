// lib/presentation/screens/main_navigation/bottom_nav_screen.dart
import 'package:flutter/material.dart';
import '../../../app/constants/app_colors.dart';

class BottomNavScreen extends StatelessWidget {
  const BottomNavScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Text('Home Screen - Authenticated!'),
      ),
    );
  }
}