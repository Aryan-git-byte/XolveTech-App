// lib/providers/auth_provider.dart
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../core/services/auth_service.dart';
import '../core/exceptions/app_exceptions.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  bool _isLoading = false;
  String? _errorMessage;
  
  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _user != null;
  
  AuthProvider() {
    // Listen to auth state changes
    _authService.authStateChanges.listen((User? user) {
      _user = user;
      notifyListeners();
    });
    
    // Set initial user
    _user = _authService.currentUser;
  }
  
  // Sign Up with Email & Password
  Future<bool> signUpWithEmailPassword({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      _setLoading(true);
      _clearError();
      
      await _authService.signUpWithEmailPassword(
        email: email,
        password: password,
        name: name,
      );
      
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign In with Email & Password
  Future<bool> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _clearError();
      
      await _authService.signInWithEmailPassword(
        email: email,
        password: password,
      );
      
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign In with Google
  Future<bool> signInWithGoogle() async {
    try {
      _setLoading(true);
      _clearError();
      
      final result = await _authService.signInWithGoogle();
      return result != null;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Send Password Reset Email
  Future<bool> sendPasswordResetEmail(String email) async {
    try {
      _setLoading(true);
      _clearError();
      
      await _authService.sendPasswordResetEmail(email);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign Out
  Future<void> signOut() async {
    try {
      _setLoading(true);
      await _authService.signOut();
    } catch (e) {
      _setError('Failed to sign out. Please try again.');
    } finally {
      _setLoading(false);
    }
  }
  
  // Helper Methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }
  
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
  
  void clearError() {
    _clearError();
  }
}
