class WalletModel {
  final String publicKey;
  final String? encryptedPrivateKeyReference; // e.g., key in secure storage
  double balance;
  bool isFunded;

  WalletModel({
    required this.publicKey,
    this.encryptedPrivateKeyReference,
    this.balance = 0.0,
    this.isFunded = false,
  }) {
    _validatePublicKey(publicKey);
  }

  void _validatePublicKey(String publicKey) {
    // Basic Stellar public key validation (starts with 'G', 56 chars)
    if (!publicKey.startsWith('G') || publicKey.length != 56) {
      throw ArgumentError('Invalid Stellar public key format.');
    }
  }
}
