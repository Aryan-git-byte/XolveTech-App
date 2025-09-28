// lib/app/routes/app_routes.dart
class AppRoutes {
  // Auth Routes
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  
  // Main Navigation Routes
  static const String home = '/';
  static const String shop = '/shop';
  static const String courses = '/courses';
  static const String community = '/community';
  static const String profile = '/profile';
  
  // Kit Routes
  static const String kitDetail = '/kit/:kitId';
  static const String kitCheckout = '/checkout';
  static const String orderHistory = '/orders';
  
  // Course Routes
  static const String courseDetail = '/course/:courseId';
  static const String videoPlayer = '/video/:lessonId';
  static const String quiz = '/quiz/:quizId';
  
  // Community Routes
  static const String forums = '/forums';
  static const String forumDetail = '/forum/:forumId';
  static const String chat = '/chat/:chatId';
  static const String createPost = '/create-post';
  
  // Profile Routes
  static const String editProfile = '/profile/edit';
  static const String badges = '/profile/badges';
  static const String certificates = '/profile/certificates';
  static const String settings = '/settings';
}