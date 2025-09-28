import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/services/firebase_service.dart';
import 'core/services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await FirebaseService.initialize();
  
  // Initialize Notifications
  final notificationService = NotificationService();
  await notificationService.initialize();
  
  runApp(const XolveTechApp());
}