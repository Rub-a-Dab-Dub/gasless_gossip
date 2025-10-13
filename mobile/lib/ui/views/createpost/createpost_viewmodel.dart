import 'dart:io';
import 'dart:typed_data';
import 'package:mobile/app/app.router.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:photo_manager/photo_manager.dart';

class CreatepostViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  final _imagePicker = ImagePicker();

  String _postText = '';
  List<File> _selectedImages = [];
  List<AssetEntity> _recentMedia = [];
  bool _isDraft = false;
  bool _isLoadingMedia = false;
  String? _permissionError;

  String get postText => _postText;
  List<File> get selectedImages => _selectedImages;
  List<AssetEntity> get recentMedia => _recentMedia;
  bool get isDraft => _isDraft;
  bool get isLoadingMedia => _isLoadingMedia;
  String? get permissionError => _permissionError;
  bool get canPost => _postText.trim().isNotEmpty || _selectedImages.isNotEmpty;

  void updatePostText(String text) {
    _postText = text;
    notifyListeners();
  }

  void goBack() {
    _navigationService.back();
  }

  Future<void> loadRecentMedia() async {
    _isLoadingMedia = true;
    _permissionError = null;
    notifyListeners();

    try {
      // Request permission with proper handling for iOS 14+
      final PermissionState permission =
          await PhotoManager.requestPermissionExtend();

      if (permission.isAuth || permission == PermissionState.limited) {
        // Get recent albums
        final List<AssetPathEntity> albums =
            await PhotoManager.getAssetPathList(
          type: RequestType.common, // Photos and videos
          onlyAll: true,
        );

        if (albums.isNotEmpty) {
          // Get recent media from the first album (usually "Recent" or "All Photos")
          final List<AssetEntity> media = await albums.first.getAssetListRange(
            start: 0,
            end: 20, // Get 20 most recent items
          );

          _recentMedia = media;
        }
      } else if (permission == PermissionState.denied) {
        _permissionError =
            'Photo access denied. You can enable it in Settings.';
        print('Photo permission denied');
      } else if (permission == PermissionState.restricted) {
        _permissionError = 'Photo access is restricted on this device.';
        print('Photo permission restricted');
      } else {
        _permissionError = 'Unable to access photos. Please check permissions.';
        print('Photo permission state: $permission');
      }
    } catch (e) {
      print('Error loading recent media: $e');
      _permissionError =
          'Failed to load recent photos. Using camera roll instead.';
      // Fallback: Don't show recent photos section if plugin fails
      _recentMedia = [];
    }

    _isLoadingMedia = false;
    notifyListeners();
  }

  Future<void> selectFromRecentMedia(AssetEntity asset) async {
    if (_selectedImages.length >= 4) return; // Max 4 images

    try {
      final File? file = await asset.file;
      if (file != null) {
        _selectedImages.add(file);
        notifyListeners();
      }
    } catch (e) {
      print('Error selecting from recent media: $e');
    }
  }

  Future<void> pickImage() async {
    if (_selectedImages.length >= 4) return; // Max 4 images like Twitter

    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );

      if (image != null) {
        _selectedImages.add(File(image.path));
        notifyListeners();
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  Future<void> takePhoto() async {
    if (_selectedImages.length >= 4) return; // Max 4 images

    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );

      if (image != null) {
        _selectedImages.add(File(image.path));
        notifyListeners();
      }
    } catch (e) {
      print('Error taking photo: $e');
    }
  }

  void removeImage(int index) {
    if (index >= 0 && index < _selectedImages.length) {
      _selectedImages.removeAt(index);
      notifyListeners();
    }
  }

  void saveDraft() {
    _isDraft = true;
    // TODO: Implement draft saving logic
    print('Draft saved');
    _navigationService.back();
  }

  void createPost() async {
    if (!canPost) return;

    setBusy(true);

    try {
      // TODO: Implement your actual API call here
      // Example:
      // await _postService.createPost(
      //   text: _postText,
      //   images: _selectedImages,
      // );

      print('Creating post with text: $_postText');
      print('Images: ${_selectedImages.length}');

      // Calculate XP based on content (example logic)
      int earnedXP = 12; // Base XP for posting
      if (_selectedImages.isNotEmpty) {
        earnedXP += _selectedImages.length * 3; // 3 XP per image
      }
      if (_postText.length > 100) {
        earnedXP += 5; // Bonus for longer posts
      }

      // Navigate to success view
      await _navigationService.navigateToPostsuccessView(
          // xpEarned: earnedXP,
          );
    } catch (e) {
      print('Error creating post: $e');
      // TODO: Show error dialog/snackbar
    } finally {
      setBusy(false);
    }
  }

  // Method to retry loading media if permission was initially denied
  Future<void> retryLoadMedia() async {
    await loadRecentMedia();
  }
}
