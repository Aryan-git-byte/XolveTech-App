// lib/app/app.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../providers/user_provider.dart';
import '../providers/kit_provider.dart';
import '../providers/course_provider.dart';
import '../presentation/screens/auth/login_screen.dart';
import '../presentation/screens/auth/register_screen.dart';
import '../presentation/screens/main_navigation/bottom_nav_screen.dart';
import 'constants/app_colors.dart';
import 'constants/app_text_styles.dart';
import 'routes/app_routes.dart';

class XolveTechApp extends StatelessWidget {
  const XolveTechApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => KitProvider()),
        ChangeNotifierProvider(create: (_) => CourseProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return MaterialApp.router(
            title: 'XolveTech',
            debugShowCheckedModeBanner: false,
            theme: _buildTheme(),
            routerConfig: _buildRouter(authProvider),
          );
        },
      ),
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      useMaterial3: true,
      fontFamily: AppTextStyles.fontFamily,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryBlue600,
        brightness: Brightness.light,
        primary: AppColors.primaryBlue600,
        secondary: AppColors.actionOrange500,
        surface: AppColors.surface,
        error: AppColors.error,
      ),
      appBarTheme: const AppBarTheme(
        elevation: 0,
        centerTitle: true,
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.textPrimary,
        titleTextStyle: AppTextStyles.headingLg,
      ),
    );
  }

  GoRouter _buildRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: AppRoutes.login,
      redirect: (context, state) {
        final isAuthenticated = authProvider.isAuthenticated;
        final isOnAuthScreen = state.uri.toString() == AppRoutes.login || 
                              state.uri.toString() == AppRoutes.register;
        
        if (!isAuthenticated && !isOnAuthScreen) {
          return AppRoutes.login;
        }
        
        if (isAuthenticated && isOnAuthScreen) {
          return AppRoutes.home;
        }
        
        return null;
      },
      routes: [
        GoRoute(
          path: AppRoutes.login,
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: AppRoutes.register,
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: AppRoutes.home,
          builder: (context, state) => const BottomNavScreen(),
        ),
      ],
    );
  }
}