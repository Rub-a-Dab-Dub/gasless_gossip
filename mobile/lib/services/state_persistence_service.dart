import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import '../models/room.dart';

abstract class StatePersistenceService {
  Future<void> saveUserState(User user);
  Future<User?> loadUserState();

  Future<void> saveRoomState(List<Room> rooms);
  Future<List<Room>?> loadRoomState();

  Future<void> saveAppSettings(Map<String, dynamic> settings);
  Future<Map<String, dynamic>?> loadAppSettings();

  Future<void> clearAllState();
}

class SharedPreferencesStatePersistence implements StatePersistenceService {
  static const String _kUserState = 'user_state';
  static const String _kRoomState = 'room_state';
  static const String _kAppSettings = 'app_settings';
  static const String _kWalletPrefs = 'wallet_preferences';

  @override
  Future<void> saveUserState(User user) async {
    await _saveJson(_kUserState, user.toJson());
  }

  @override
  Future<User?> loadUserState() async {
    final Map<String, dynamic>? data = await _loadJson(_kUserState);
    if (data == null) return null;
    try {
      return User.fromJson(data);
    } catch (_) {
      await _remove(_kUserState);
      return null;
    }
  }

  @override
  Future<void> saveRoomState(List<Room> rooms) async {
    final List<Map<String, dynamic>> payload = rooms.map((r) => r.toJson()).toList();
    await _saveString(_kRoomState, json.encode(payload));
  }

  @override
  Future<List<Room>?> loadRoomState() async {
    final String? s = await _loadString(_kRoomState);
    if (s == null) return null;
    try {
      final List<dynamic> list = json.decode(s) as List<dynamic>;
      return list.map((e) => Room.fromJson(Map<String, dynamic>.from(e as Map))).toList();
    } catch (_) {
      await _remove(_kRoomState);
      return null;
    }
  }

  @override
  Future<void> saveAppSettings(Map<String, dynamic> settings) async {
    await _saveJson(_kAppSettings, settings);
  }

  @override
  Future<Map<String, dynamic>?> loadAppSettings() async {
    return _loadJson(_kAppSettings);
  }

  @override
  Future<void> clearAllState() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kUserState);
    await prefs.remove(_kRoomState);
    await prefs.remove(_kAppSettings);
    await prefs.remove(_kWalletPrefs);
  }

  Future<void> _saveJson(String key, Map<String, dynamic> data) async {
    await _saveString(key, json.encode(data));
  }

  Future<Map<String, dynamic>?> _loadJson(String key) async {
    final String? s = await _loadString(key);
    if (s == null) return null;
    try {
      return json.decode(s) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveString(String key, String value) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<String?> _loadString(String key) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<void> _remove(String key) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }
}


