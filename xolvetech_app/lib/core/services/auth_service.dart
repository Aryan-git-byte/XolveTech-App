// lib/core/services/auth_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../app/constants/firebase_collections.dart';
import '../exceptions/app_exceptions.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();
  
  // Sign Up with Email & Password
  Future<UserCredential> signUpWithEmailPassword({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Update display name
      await userCredential.user?.updateDisplayName(name);
      
      // Create user document in Firestore
      if (userCredential.user != null) {
        await createUserDocument(userCredential.user!, name);
      }
      
      return userCredential;
    } on FirebaseAuthException catch (e) {
      throw AuthException(_getAuthErrorMessage(e.code), e.code);
    } catch (e) {
      throw AuthException('An unexpected error occurred during sign up.');
    }
  }
  
  // Sign In with Email & Password
  Future<UserCredential> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw AuthException(_getAuthErrorMessage(e.code), e.code);
    } catch (e) {
      throw AuthException('An unexpected error occurred during sign in.');
    }
  }
  
  // Sign In with Google
  Future<UserCredential?> signInWithGoogle() async {
    try {
      // Trigger the authentication flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      
      if (googleUser == null) {
        // User canceled the sign-in
        return null;
      }

      // Obtain the auth details from the request
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // Sign in to Firebase with the Google credential
      final userCredential = await _auth.signInWithCredential(credential);
      
      // Create or update user document if this is a new user
      if (userCredential.additionalUserInfo?.isNewUser == true && userCredential.user != null) {
        await createUserDocument(
          userCredential.user!, 
          userCredential.user!.displayName ?? 'User',
        );
      }
      
      return userCredential;
    } on FirebaseAuthException catch (e) {
      throw AuthException(_getAuthErrorMessage(e.code), e.code);
    } catch (e) {
      throw AuthException('An unexpected error occurred during Google sign in.');
    }
  }
  
  // Send Password Reset Email
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw AuthException(_getAuthErrorMessage(e.code), e.code);
    } catch (e) {
      throw AuthException('Failed to send password reset email.');
    }
  }
  
  // Sign Out
  Future<void> signOut() async {
    try {
      await Future.wait([
        _auth.signOut(),
        _googleSignIn.signOut(),
      ]);
    } catch (e) {
      throw AuthException('Failed to sign out.');
    }
  }
  
  // Create user document in Firestore
  Future<void> createUserDocument(User user, String name) async {
    try {
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
    } catch (e) {
      throw AuthException('Failed to create user profile.');
    }
  }
  
  // Get user-friendly error messages
  String _getAuthErrorMessage(String errorCode) {
    switch (errorCode) {
      case 'user-not-found':
        return 'No account found with this email address.';
      case 'wrong-password':
        return 'Incorrect password. Please try again.';
      case 'email-already-in-use':
        return 'An account already exists with this email address.';
      case 'weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'invalid-email':
        return 'Please enter a valid email address.';
      case 'user-disabled':
        return 'This account has been disabled.';
      case 'too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'operation-not-allowed':
        return 'This sign-in method is not enabled.';
      case 'invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      case 'invalid-verification-code':
        return 'Invalid verification code.';
      case 'invalid-verification-id':
        return 'Invalid verification ID.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  }
}