import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'package:mobile/ui/common/app_colors.dart';
import 'package:mobile/ui/common/ui_helpers.dart';
import 'personal_chat_funding_viewmodel.dart';

class PersonalChatFundingView extends StackedView<PersonalChatFundingViewModel> {
  const PersonalChatFundingView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    PersonalChatFundingViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.6),
      body: Center(
        child: Container(
          width: screenWidth(context) * 0.9,
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: kcDarkGreyColor,
            borderRadius: BorderRadius.circular(15),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Send Funds',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                verticalSpaceMedium,
                _buildTextField(
                  controller: viewModel.amountController,
                  hintText: 'Amount',
                  prefixText: '\$',
                  errorText: viewModel.amountError,
                  onChanged: viewModel.onAmountChanged,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                verticalSpaceSmall,
                _buildTextField(
                  controller: viewModel.addressController,
                  hintText: 'Recipient Address',
                  errorText: viewModel.addressError,
                  onChanged: viewModel.onAddressChanged,
                ),
                verticalSpaceSmall,
                _buildTextField(
                  controller: viewModel.messageController,
                  hintText: 'Message (optional)',
                  onChanged: viewModel.onMessageChanged,
                  maxLines: 3,
                ),
                verticalSpaceMedium,
                MaterialButton(
                  onPressed: viewModel.isBusy ? null : viewModel.sendFunds,
                  color: kcPrimaryColor,
                  minWidth: double.infinity,
                  height: 50,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: viewModel.isBusy
                      ? const CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation(Colors.white),
                        )
                      : const Text(
                          'Send Funds',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    String? prefixText,
    String? errorText,
    required void Function(String) onChanged,
    TextInputType? keyboardType,
    int? maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
        prefixText: prefixText,
        prefixStyle: const TextStyle(color: Colors.white, fontSize: 16),
        errorText: errorText,
        filled: true,
        fillColor: Colors.black.withOpacity(0.3),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: kcPrimaryColor, width: 2),
        ),
      ),
    );
  }

  @override
  PersonalChatFundingViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      PersonalChatFundingViewModel();
}
