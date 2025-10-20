import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:stacked/stacked.dart';
import 'package:mobile/ui/common/app_assets.dart';

import 'receive_scan_viewmodel.dart';

class ReceiveScanView extends StackedView<ReceiveScanViewModel> {
  const ReceiveScanView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    ReceiveScanViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            _buildHeader(viewModel),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    const SizedBox(height: 24),
                    _buildWalletDetails(viewModel),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ReceiveScanViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back button
          GestureDetector(
            onTap: viewModel.onBack,
            child: const Icon(
              Icons.arrow_back,
              color: Color(0xFFF1F7F6),
              size: 24,
            ),
          ),

          // Title
          Expanded(
            child: Text(
              'My Wallet',
              textAlign: TextAlign.center,
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFD6D8D3),
              ),
            ),
          ),

          // Placeholder for symmetry
          const SizedBox(width: 24),
        ],
      ),
    );
  }

  Widget _buildWalletDetails(ReceiveScanViewModel viewModel) {
    return Column(
      children: [
        // Main card with QR code
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
              bottomLeft: Radius.circular(4),
              bottomRight: Radius.circular(4),
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF14F1D9).withOpacity(0.04),
                blurRadius: 24,
                spreadRadius: 0,
              ),
            ],
          ),
          child: Column(
            children: [
              // Receive label and token
              Column(
                children: [
                  Text(
                    'RECEIVE',
                    style: GoogleFonts.baloo2(
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF0E9186),
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${viewModel.selectedToken} Address',
                    style: GoogleFonts.baloo2(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFF1F7F6),
                      height: 1.14,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // QR Code
              Container(
                width: 248,
                height: 248,
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(
                    color: const Color(0xFF212424),
                    width: 1,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: QrImageView(
                    data: viewModel.qrCodeData,
                    version: QrVersions.auto,
                    size: 236,
                    backgroundColor: Colors.white,
                    errorCorrectionLevel: QrErrorCorrectLevel.H,
                    padding: const EdgeInsets.all(16),
                    embeddedImage: const AssetImage(AppAssets.stark),
                    embeddedImageStyle: const QrEmbeddedImageStyle(
                      size: Size(48, 48),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Domain name section
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            borderRadius: BorderRadius.circular(4),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF14F1D9).withOpacity(0.06),
                blurRadius: 12,
                spreadRadius: 0,
              ),
            ],
          ),
          child: Column(
            children: [
              Text(
                'domain name',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                  height: 1.33,
                ),
              ),
              const SizedBox(height: 4),
              GestureDetector(
                onTap: viewModel.copyDomainName,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          viewModel.domainName,
                          style: GoogleFonts.baloo2(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFFF1F7F6),
                            height: 1.14,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Icons.copy,
                        size: 12,
                        color: Color(0xFFA3A9A6),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // Account address section
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF121418),
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF14F1D9).withOpacity(0.06),
                blurRadius: 12,
                spreadRadius: 0,
              ),
            ],
          ),
          child: Column(
            children: [
              Text(
                'account address',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                  height: 1.33,
                ),
              ),
              const SizedBox(height: 4),
              GestureDetector(
                onTap: viewModel.copyAccountAddress,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        viewModel.accountAddress,
                        style: GoogleFonts.baloo2(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFF1F7F6),
                          height: 1.14,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Icons.copy,
                        size: 12,
                        color: Color(0xFFA3A9A6),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  ReceiveScanViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      ReceiveScanViewModel();
}
