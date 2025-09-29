import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'personal_request_viewmodel.dart';

class PersonalRequestView extends StackedView<PersonalRequestViewModel> {
  const PersonalRequestView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    PersonalRequestViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.6),
      body: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.9,
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: Colors.grey.shade900,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Stack(
            children: [
              Form(
                key: viewModel.formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      "Request Funds",
                      style: TextStyle(
                        fontSize: 28,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      "Ask for the amount you'd like to receive securely.",
                      style: TextStyle(color: Colors.white70),
                    ),

                    const SizedBox(height: 30),
                    Row(
                      children: [
                        Expanded(
                          child: RadioListTile<String>(
                            title: const Text('Token Request', style: TextStyle(color: Colors.white)),
                            value: 'token',
                            groupValue: viewModel.requestType,
                            onChanged: (value) {
                              viewModel.requestType = value!;
                              viewModel.notifyListeners();
                            },
                            activeColor: Colors.pinkAccent,
                          ),
                        ),
                        Expanded(
                          child: RadioListTile<String>(
                            title: const Text('Action Request', style: TextStyle(color: Colors.white)),
                            value: 'action',
                            groupValue: viewModel.requestType,
                            onChanged: (value) {
                              viewModel.requestType = value!;
                              viewModel.notifyListeners();
                            },
                            activeColor: Colors.pinkAccent,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    if (viewModel.requestType == 'token')
                      TextFormField(
                        controller: viewModel.amountController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(color: Colors.white, fontSize: 40),
                        decoration: const InputDecoration(
                          prefixText: "\$",
                          prefixStyle: TextStyle(color: Colors.white, fontSize: 40),
                          hintText: "0.00",
                          hintStyle: TextStyle(color: Colors.white38),
                          border: InputBorder.none,
                        ),
                        validator: (v) {
                          if (v == null || v.isEmpty) return "Enter an amount";
                          if (double.tryParse(v) == null) return "Invalid amount";
                          return null;
                        },
                      )
                    else
                      DropdownButtonFormField<String>(
                        value: viewModel.selectedRoomId,
                        decoration: const InputDecoration(
                          hintText: "Select Secret Room",
                          hintStyle: TextStyle(color: Colors.white38),
                          border: OutlineInputBorder(),
                        ),
                        items: viewModel.availableRooms.map((room) {
                          return DropdownMenuItem<String>(
                            value: room,
                            child: Text(room, style: const TextStyle(color: Colors.white)),
                          );
                        }).toList(),
                        onChanged: (value) {
                          viewModel.selectedRoomId = value;
                        },
                        validator: (v) => v == null ? "Select a room" : null,
                        dropdownColor: Colors.grey.shade800,
                      ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: viewModel.recipientController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: "@username",
                        hintStyle: TextStyle(color: Colors.white38),
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return "Enter recipient";
                        if (!RegExp(r'^@\w+$').hasMatch(v)) return "Invalid username format";
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: viewModel.messageController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: "Optional message",
                        hintStyle: TextStyle(color: Colors.white38),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.pinkAccent,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30)),
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      onPressed: viewModel.isBusy
                          ? null
                          : () async => await viewModel.sendRequest(),
                      child: viewModel.isBusy
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text("Send Request",
                              style: TextStyle(color: Colors.white, fontSize: 18)),
                    ),
                    const SizedBox(height: 10),
                    if (viewModel.requestStatus.isNotEmpty)
                      Text(
                        viewModel.requestStatus,
                        style: const TextStyle(color: Colors.white70),
                      ),
                  ],
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: IconButton(
                  icon: const Icon(Icons.close, color: Colors.white),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
