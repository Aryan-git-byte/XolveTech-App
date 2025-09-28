// lib/core/services/firebase_service.dart
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';

class FirebaseService {
  static FirebaseFirestore get firestore => FirebaseFirestore.instance;
  static FirebaseAuth get auth => FirebaseAuth.instance;
  static FirebaseStorage get storage => FirebaseStorage.instance;
  
  static Future<void> initialize() async {
    await Firebase.initializeApp();
    
    // Enable offline persistence
    firestore.settings = const Settings(
      persistenceEnabled: true,
      cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
    );
  }
  
  static User? get currentUser => auth.currentUser;
  static String? get currentUserId => auth.currentUser?.uid;
  static bool get isSignedIn => auth.currentUser != null;
  
  static Stream<User?> get authStateChanges => auth.authStateChanges();
}