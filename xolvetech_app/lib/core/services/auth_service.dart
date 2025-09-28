// Create: lib/core/services/auth_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../app/constants/firebase_collections.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();
  
  Future<UserCredential> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    return await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
  }
  
  Future<void> signOut() async {
    await _auth.signOut();
  }
  
  // Create user document
  Future<void> createUserDocument(User user, String name) async {
    final userDoc = _firestore.collection(FirebaseCollections.users).doc(user.uid);
    
    final userData = {
      'uid': user.uid,
      'email': user.email,
      'displayName': name,
      'profileImageUrl': user.photoURL,
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
      'purchasedKits': <String>[],
      'completedCourses': <String>[],
      'badges': <Map<String, dynamic>>[],
      'points': 0,
      'level': 1,
      'isEmailVerified': user.emailVerified,
    };
    
    await userDoc.set(userData, SetOptions(merge: true));
  }
}
