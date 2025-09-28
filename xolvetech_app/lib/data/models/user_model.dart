// lib/data/models/user_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String? profileImageUrl;
  final List<String> purchasedKits;
  final List<String> completedCourses;
  final List<Map<String, dynamic>> badges;
  final int points;
  final int level;
  final bool isEmailVerified;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  UserModel({
    required this.uid,
    required this.email,
    required this.displayName,
    this.profileImageUrl,
    required this.purchasedKits,
    required this.completedCourses,
    required this.badges,
    required this.points,
    required this.level,
    required this.isEmailVerified,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      displayName: map['displayName'] ?? '',
      profileImageUrl: map['profileImageUrl'],
      purchasedKits: List<String>.from(map['purchasedKits'] ?? []),
      completedCourses: List<String>.from(map['completedCourses'] ?? []),
      badges: List<Map<String, dynamic>>.from(map['badges'] ?? []),
      points: map['points'] ?? 0,
      level: map['level'] ?? 1,
      isEmailVerified: map['isEmailVerified'] ?? false,
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: (map['updatedAt'] as Timestamp).toDate(),
    );
  }
  
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel.fromMap(data);
  }
  
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'displayName': displayName,
      'profileImageUrl': profileImageUrl,
      'purchasedKits': purchasedKits,
      'completedCourses': completedCourses,
      'badges': badges,
      'points': points,
      'level': level,
      'isEmailVerified': isEmailVerified,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
  
  UserModel copyWith({
    String? uid,
    String? email,
    String? displayName,
    String? profileImageUrl,
    List<String>? purchasedKits,
    List<String>? completedCourses,
    List<Map<String, dynamic>>? badges,
    int? points,
    int? level,
    bool? isEmailVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      purchasedKits: purchasedKits ?? this.purchasedKits,
      completedCourses: completedCourses ?? this.completedCourses,
      badges: badges ?? this.badges,
      points: points ?? this.points,
      level: level ?? this.level,
      isEmailVerified: isEmailVerified ?? this.isEmailVerified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}