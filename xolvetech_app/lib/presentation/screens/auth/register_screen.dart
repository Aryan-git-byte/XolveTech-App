// lib/presentation/screens/auth/register_screen.dart
import 'package:flutter/material.dart';
import '../../../app/constants/app_colors.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Text('Register Screen'),
      ),
    );
  }
}