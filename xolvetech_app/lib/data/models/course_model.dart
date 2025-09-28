// lib/data/models/course_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class CourseModel {
  final String id;
  final String title;
  final String description;
  final String instructorName;
  final String instructorImageUrl;
  final String thumbnailUrl;
  final String? videoIntroUrl;
  final String category;
  final int difficulty; // 1-5 scale
  final int duration; // in minutes
  final List<String> learningOutcomes;
  final List<String> prerequisites;
  final List<String> tags;
  final double rating;
  final int enrollmentCount;
  final bool isFree;
  final double? price;
  final List<ModuleModel> modules;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.instructorName,
    required this.instructorImageUrl,
    required this.thumbnailUrl,
    this.videoIntroUrl,
    required this.category,
    required this.difficulty,
    required this.duration,
    required this.learningOutcomes,
    required this.prerequisites,
    required this.tags,
    required this.rating,
    required this.enrollmentCount,
    required this.isFree,
    this.price,
    required this.modules,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory CourseModel.fromMap(Map<String, dynamic> map) {
    return CourseModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      instructorName: map['instructorName'] ?? '',
      instructorImageUrl: map['instructorImageUrl'] ?? '',
      thumbnailUrl: map['thumbnailUrl'] ?? '',
      videoIntroUrl: map['videoIntroUrl'],
      category: map['category'] ?? '',
      difficulty: map['difficulty'] ?? 1,
      duration: map['duration'] ?? 0,
      learningOutcomes: List<String>.from(map['learningOutcomes'] ?? []),
      prerequisites: List<String>.from(map['prerequisites'] ?? []),
      tags: List<String>.from(map['tags'] ?? []),
      rating: (map['rating'] ?? 0).toDouble(),
      enrollmentCount: map['enrollmentCount'] ?? 0,
      isFree: map['isFree'] ?? true,
      price: map['price']?.toDouble(),
      modules: (map['modules'] as List<dynamic>?)
              ?.map((module) => ModuleModel.fromMap(module as Map<String, dynamic>))
              .toList() ?? [],
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: (map['updatedAt'] as Timestamp).toDate(),
    );
  }
  
  factory CourseModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    data['id'] = doc.id;
    return CourseModel.fromMap(data);
  }
  
  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'instructorName': instructorName,
      'instructorImageUrl': instructorImageUrl,
      'thumbnailUrl': thumbnailUrl,
      'videoIntroUrl': videoIntroUrl,
      'category': category,
      'difficulty': difficulty,
      'duration': duration,
      'learningOutcomes': learningOutcomes,
      'prerequisites': prerequisites,
      'tags': tags,
      'rating': rating,
      'enrollmentCount': enrollmentCount,
      'isFree': isFree,
      'price': price,
      'modules': modules.map((module) => module.toMap()).toList(),
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
  
  String get difficultyText {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Easy';
      case 3: return 'Medium';
      case 4: return 'Hard';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  }
  
  String get formattedDuration {
    final hours = duration ~/ 60;
    final minutes = duration % 60;
    if (hours > 0) {
      return '${hours}h ${minutes}m';
    }
    return '${minutes}m';
  }
  
  int get totalLessons => modules.fold(0, (total, module) => total + module.lessons.length);
}

class ModuleModel {
  final String id;
  final String title;
  final String description;
  final int order;
  final List<LessonModel> lessons;
  
  ModuleModel({
    required this.id,
    required this.title,
    required this.description,
    required this.order,
    required this.lessons,
  });
  
  factory ModuleModel.fromMap(Map<String, dynamic> map) {
    return ModuleModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      order: map['order'] ?? 0,
      lessons: (map['lessons'] as List<dynamic>?)
              ?.map((lesson) => LessonModel.fromMap(lesson as Map<String, dynamic>))
              .toList() ?? [],
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'order': order,
      'lessons': lessons.map((lesson) => lesson.toMap()).toList(),
    };
  }
  
  int get totalDuration => lessons.fold(0, (total, lesson) => total + lesson.duration);
}

class LessonModel {
  final String id;
  final String title;
  final String description;
  final String type; // video, quiz, reading, assignment
  final int order;
  final int duration; // in minutes
  final String? videoUrl;
  final String? resourceUrl;
  final Map<String, dynamic>? quizData;
  final bool isPreview;
  
  LessonModel({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.order,
    required this.duration,
    this.videoUrl,
    this.resourceUrl,
    this.quizData,
    required this.isPreview,
  });
  
  factory LessonModel.fromMap(Map<String, dynamic> map) {
    return LessonModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      type: map['type'] ?? 'video',
      order: map['order'] ?? 0,
      duration: map['duration'] ?? 0,
      videoUrl: map['videoUrl'],
      resourceUrl: map['resourceUrl'],
      quizData: map['quizData'] as Map<String, dynamic>?,
      isPreview: map['isPreview'] ?? false,
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'order': order,
      'duration': duration,
      'videoUrl': videoUrl,
      'resourceUrl': resourceUrl,
      'quizData': quizData,
      'isPreview': isPreview,
    };
  }
  
  String get formattedDuration {
    final hours = duration ~/ 60;
    final minutes = duration % 60;
    if (hours > 0) {
      return '${hours}h ${minutes}m';
    }
    return '${minutes}m';
  }
}