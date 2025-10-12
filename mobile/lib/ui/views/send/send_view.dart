import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';

import 'send_viewmodel.dart';

class SendView extends StackedView<SendViewModel> {
  const SendView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    SendViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: Container(
        padding: const EdgeInsets.only(left: 25.0, right: 25.0),
        child: const Center(child: Text("SendView")),
      ),
    );
  }

  @override
  SendViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      SendViewModel();
}
