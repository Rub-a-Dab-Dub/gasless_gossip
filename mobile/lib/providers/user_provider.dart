import 'package:flutter/foundation.dart';

import '../models/user.dart';
import '../models/xp.dart';
import '../services/api_service.dart';

class UserProvider extends ChangeNotifier {
  final ApiService _apiService;

  User? _currentUser;
  bool _isLoading = false;
  String? _error;
  List<XPHistoryEntry> _xpHistory = <XPHistoryEntry>[];

  UserProvider({ApiService? apiService}) : _apiService = apiService ?? ApiService();

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;
  List<XPHistoryEntry> get xpHistory => List.unmodifiable(_xpHistory);
  double get levelProgress => _currentUser?.levelProgress ?? 0.0;

  Future<void> loadUser(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      await _apiService.initialize();
      final Map<String, dynamic> data = await _apiService.getUserXP(userId);
      final int xp = data['xp'] as int;
      final int level = data['level'] as int;
      final int nextLevelXp = data['nextLevelXp'] as int;
      final List<dynamic> historyRaw = (data['history'] as List<dynamic>? ?? const []);
      final List<XPHistoryEntry> history = historyRaw
          .map((e) => XPHistoryEntry.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();

      _xpHistory = history;
      _currentUser = User(
        id: data['userId'] as String? ?? userId,
        username: null,
        avatarUrl: null,
        xp: xp,
        level: level,
        nextLevelXp: nextLevelXp,
        xpHistory: history,
        createdAt: DateTime.fromMillisecondsSinceEpoch(0),
        lastActive: DateTime.now(),
      );
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateXP(int xpGain, String type) async {
    final user = _currentUser;
    if (user == null) return;
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final Map<String, dynamic> res = await _apiService.updateUserXP(user.id, xpGain);
      final int newXp = (res['newXp'] as int?) ?? (user.xp + xpGain);
      final int level = XPCalculator.calculateLevel(newXp);
      final int nextLevelXp = XPCalculator.calculateNextLevelXp(level);
      final XPHistoryEntry entry = XPHistoryEntry(
        type: type,
        xp: xpGain,
        timestamp: DateTime.now(),
      );
      _xpHistory = <XPHistoryEntry>[entry, ..._xpHistory];
      _currentUser = user.copyWith(
        xp: newXp,
        level: level,
        nextLevelXp: nextLevelXp,
        xpHistory: _xpHistory,
        lastActive: DateTime.now(),
      );
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshUser() async {
    final user = _currentUser;
    if (user == null) return;
    await loadUser(user.id);
  }

  void clearUser() {
    _currentUser = null;
    _xpHistory = <XPHistoryEntry>[];
    _error = null;
    notifyListeners();
  }

  void setError(String error) {
    _error = error;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}


