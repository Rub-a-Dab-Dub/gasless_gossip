import 'dart:io';
import 'package:photo_manager/photo_manager.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/app/app.locator.dart';
import 'package:image_picker/image_picker.dart';

class UploadavatarViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();
  final _imagePicker = ImagePicker();

  List<AssetEntity> _recentMedia = [];
  bool _isLoadingMedia = false;
  String? _permissionError;

  List<AssetEntity> get recentMedia => _recentMedia;
  bool get isLoadingMedia => _isLoadingMedia;
  String? get permissionError => _permissionError;

  // Avatar image
  File? _avatarImage;
  File? get avatarImage => _avatarImage;

  // Additional images
  List<File> _selectedImages = [];
  List<File> get selectedImages => _selectedImages;

  // Room data from previous screen
  String? roomNickname;
  int? roomDuration;
  int? roomAccess;

  void initialize({
    String? nickname,
    int? duration,
    int? access,
  }) {
    roomNickname = nickname;
    roomDuration = duration;
    roomAccess = access;
    // Load recent media when page initializes
    loadRecentMedia();
  }

  Future<void> pickAvatar() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );

      if (image != null) {
        _avatarImage = File(image.path);
        notifyListeners();
      }
    } catch (e) {
      print('Error picking avatar: $e');
    }
  }

  Future<void> pickImages() async {
    try {
      final List<XFile> images = await _imagePicker.pickMultiImage(
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );

      if (images.isNotEmpty) {
        // Limit to 4 images total
        final remainingSlots = 4 - _selectedImages.length;
        final imagesToAdd = images.take(remainingSlots).toList();

        for (var image in imagesToAdd) {
          _selectedImages.add(File(image.path));
        }
        notifyListeners();
      }
    } catch (e) {
      print('Error picking images: $e');
    }
  }

  void removeImage(int index) {
    if (index >= 0 && index < _selectedImages.length) {
      _selectedImages.removeAt(index);
      notifyListeners();
    }
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

  Future<void> retryLoadMedia() async {
    await loadRecentMedia();
  }

  void goBack() {
    _navigationService.back();
  }

  void createRoom() {
    // TODO: Implement room creation with avatar and images
    // For now, navigate back to home
    _navigationService.clearStackAndShow('/bottomnav-view');
  }
}
