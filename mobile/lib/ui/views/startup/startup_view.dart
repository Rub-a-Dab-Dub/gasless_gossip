import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import 'startup_viewmodel.dart';

class StartupView extends StackedView<StartupViewModel> {
  const StartupView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    StartupViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 🌀 Fullscreen GIF background
          Image.asset(
            AppAssets.splashScreen, // e.g. assets/animations/splash.gif
            fit: BoxFit.cover,
          ),

          // 🧾 Overlay for title (optional: add gradient overlay if needed)
          Container(
            color: Colors.black.withOpacity(0.2), // subtle overlay for readability
          ),

          // 🧠 Foreground content

        ],
      ),
    );
  }

  @override
  StartupViewModel viewModelBuilder(BuildContext context) => StartupViewModel();

  @override
  void onViewModelReady(StartupViewModel viewModel) =>
      SchedulerBinding.instance.addPostFrameCallback(
        (_) => viewModel.runStartupLogic(),
      );
}
