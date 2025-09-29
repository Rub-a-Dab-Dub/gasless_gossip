import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart' as stellar;

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1).toLowerCase()}";
  }
}

class PersonalRequestViewModel extends BaseViewModel {
  final formKey = GlobalKey<FormState>();
  final amountController = TextEditingController();
  final recipientController = TextEditingController();
  final messageController = TextEditingController();

  String requestStatus = '';
  String? requestId; // To track the sent request for status fetching
  String requestType = 'token'; // 'token' or 'action'
  String? selectedRoomId; // For action requests
  List<String> availableRooms = ['Secret Room 1', 'Secret Room 2', 'Secret Room 3']; // TODO: Fetch from backend

  final stellar.StellarSDK sdk = stellar.StellarSDK.TESTNET; // Use TESTNET for development; change to MAINNET for production

  Future<bool> _verifyStellarKey(String publicKey) async {
    try {
      await sdk.accounts.account(publicKey);
      return true; // Key exists
    } catch (e) {
      return false; // Invalid key
    }
  }

  Future<void> sendRequest() async {
    if (!formKey.currentState!.validate()) return;

    setBusy(true);
    requestStatus = 'Verifying identities...';
    notifyListeners();

    try {
      // Get actual keys (placeholder - replace with real logic, e.g., from wallet or user profile)
      final senderPublicKey = "G..."; // TODO: Get from current user
      final recipientPublicKey = "G..."; // TODO: Lookup from recipient username via backend or local mapping

      // Verify Stellar identities
      final senderValid = await _verifyStellarKey(senderPublicKey);
      final recipientValid = await _verifyStellarKey(recipientPublicKey);

      if (!senderValid || !recipientValid) {
        requestStatus = 'Error: Invalid Stellar identity';
        setBusy(false);
        notifyListeners();
        return;
      }

      requestStatus = 'Sending request...';
      notifyListeners();

      // Real backend connection (replace with your NestJS endpoint)
      final response = await http.post(
        Uri.parse("https://api.yourapp.com/requests"), // TODO: Replace with actual URL
        headers: {
          "Content-Type": "application/json",
          // TODO: Add auth headers, e.g., "Authorization": "Bearer $token"
        },
        body: jsonEncode({
          "type": requestType,
          if (requestType == 'token') "amount": double.parse(amountController.text),
          if (requestType == 'action') "roomId": selectedRoomId,
          "recipient": recipientController.text,
          "message": messageController.text,
          "senderStellarKey": senderPublicKey,
          "recipientStellarKey": recipientPublicKey,
        }),
      );

      if (response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        requestId = responseData['id']; // Assume backend returns request ID
        requestStatus = 'Request sent successfully! Status: Pending';
        await fetchRequestStatus(); // Fetch initial status
      } else {
        requestStatus = 'Error: ${response.body}';
      }
    } catch (e) {
      requestStatus = 'Error: $e';
    }

    setBusy(false);
    notifyListeners();
  }

  Future<void> fetchRequestStatus() async {
    if (requestId == null) return;

    try {
      final response = await http.get(
        Uri.parse("https://api.yourapp.com/requests/$requestId/status"), // TODO: Replace with actual endpoint
        headers: {
          // TODO: Add auth headers
        },
      );

      if (response.statusCode == 200) {
        final statusData = jsonDecode(response.body);
        final status = statusData['status']; // e.g., 'pending', 'accepted', 'rejected'
        requestStatus = 'Request Status: ${status.capitalize()}';
      } else {
        requestStatus = 'Failed to fetch status';
      }
    } catch (e) {
      requestStatus = 'Error fetching status: $e';
    }

    notifyListeners();
  }
}
