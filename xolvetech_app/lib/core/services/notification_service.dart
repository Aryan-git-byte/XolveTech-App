// lib/core/services/notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../exceptions/app_exceptions.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  
  Future<void> initialize() async {
    try {
      // Request permission for iOS
      await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );
      
      // Initialize local notifications
      const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
      const iosSettings = DarwinInitializationSettings();
      const settings = InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      );
      
      await _localNotifications.initialize(settings);
      
      // Handle foreground messages
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
      
      // Handle background messages
      FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);
      
    } catch (e) {
      throw NotificationException('Failed to initialize notifications.');
    }
  }
  
  Future<String?> getToken() async {
    try {
      return await _messaging.getToken();
    } catch (e) {
      throw NotificationException('Failed to get notification token.');
    }
  }
  
  Future<void> subscribeToTopic(String topic) async {
    try {
      await _messaging.subscribeToTopic(topic);
    } catch (e) {
      throw NotificationException('Failed to subscribe to topic.');
    }
  }
  
  Future<void> unsubscribeFromTopic(String topic) async {
    try {
      await _messaging.unsubscribeFromTopic(topic);
    } catch (e) {
      throw NotificationException('Failed to unsubscribe from topic.');
    }
  }
  
  void _handleForegroundMessage(RemoteMessage message) {
    _showLocalNotification(message);
  }
  
  Future<void> _showLocalNotification(RemoteMessage message) async {
    const androidDetails = AndroidNotificationDetails(
      'xolvetech_channel',
      'XolveTech Notifications',
      channelDescription: 'Notifications from XolveTech app',
      importance: Importance.high,
      priority: Priority.high,
    );
    
    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(android: androidDetails, iOS: iosDetails);
    
    await _localNotifications.show(
      DateTime.now().millisecond,
      message.notification?.title ?? 'XolveTech',
      message.notification?.body ?? 'You have a new notification',
      details,
    );
  }
}

// Handle background messages (must be top-level function)
Future<void> _handleBackgroundMessage(RemoteMessage message) async {
  // Handle background message processing here
  // You can add logging or other background processing logic
}