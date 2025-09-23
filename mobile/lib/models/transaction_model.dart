enum TransactionStatus { pending, success, failed }

class TransactionModel {
  final String id;
  final double amount;
  final String senderAddress;
  final String recipientAddress;
  final String? message;
  final DateTime timestamp;
  final TransactionStatus status;

  TransactionModel({
    required this.id,
    required this.amount,
    required this.senderAddress,
    required this.recipientAddress,
    this.message,
    required this.timestamp,
    required this.status,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'],
      amount: json['amount'],
      senderAddress: json['senderAddress'],
      recipientAddress: json['recipientAddress'],
      message: json['message'],
      timestamp: DateTime.parse(json['timestamp']),
      status: TransactionStatus.values.firstWhere((e) => e.toString() == 'TransactionStatus.${json['status']}'),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'senderAddress': senderAddress,
      'recipientAddress': recipientAddress,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'status': status.toString().split('.').last,
    };
  }
}
