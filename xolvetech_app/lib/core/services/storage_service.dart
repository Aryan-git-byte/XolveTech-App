// lib/core/services/storage_service.dart
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';
import '../exceptions/app_exceptions.dart';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;
  
  // Upload Profile Image
  Future<String> uploadProfileImage({
    required String userId,
    required XFile imageFile,
  }) async {
    try {
      final ref = _storage.ref().child('user-uploads/$userId/profile/${DateTime.now().millisecondsSinceEpoch}.jpg');
      
      final uploadTask = ref.putFile(
        File(imageFile.path),
        SettableMetadata(contentType: 'image/jpeg'),
      );
      
      final snapshot = await uploadTask;
      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      throw StorageException('Failed to upload image. Please try again.');
    }
  }
  
  // Upload Project Image
  Future<String> uploadProjectImage({
    required String userId,
    required String projectId,
    required XFile imageFile,
  }) async {
    try {
      final ref = _storage.ref().child('user-uploads/$userId/projects/$projectId/${DateTime.now().millisecondsSinceEpoch}.jpg');
      
      final uploadTask = ref.putFile(
        File(imageFile.path),
        SettableMetadata(contentType: 'image/jpeg'),
      );
      
      final snapshot = await uploadTask;
      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      throw StorageException('Failed to upload image. Please try again.');
    }
  }
  
  // Delete File
  Future<void> deleteFile(String downloadUrl) async {
    try {
      final ref = _storage.refFromURL(downloadUrl);
      await ref.delete();
    } catch (e) {
      throw StorageException('Failed to delete file.');
    }
  }
  
  // Get Download URL
  Future<String> getDownloadUrl(String path) async {
    try {
      final ref = _storage.ref().child(path);
      return await ref.getDownloadURL();
    } catch (e) {
      throw StorageException('Failed to get file URL.');
    }
  }
}
