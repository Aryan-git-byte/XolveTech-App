// Fix: lib/providers/user_provider.dart
import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;
  
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
  
  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }
}
