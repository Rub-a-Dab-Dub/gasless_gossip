import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';

import 'joinroom_viewmodel.dart';

class JoinroomView extends StackedView<JoinroomViewModel> {
  const JoinroomView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    JoinroomViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Container(
        padding: const EdgeInsets.only(left: 25.0, right: 25.0),
        child: const Center(child: Text("JoinroomView")),
      ),
    );
  }

  @override
  JoinroomViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      JoinroomViewModel();
}
