import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stacked/stacked.dart';

import 'bottomnav_viewmodel.dart';
import 'package:mobile/ui/views/chats/chats_view.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:mobile/ui/views/profile/profile_view.dart';
import 'package:mobile/ui/views/quests/quests_view.dart';
import 'package:mobile/ui/views/rooms/rooms_view.dart';
import 'package:mobile/ui/common/app_assets.dart';

class BottomnavView extends StackedView<BottomnavViewModel> {
  final int initialIndex;

  const BottomnavView({Key? key, this.initialIndex = 0}) : super(key: key);

  @override
  Widget builder(
      BuildContext context, BottomnavViewModel viewModel, Widget? child) {
    return Scaffold(
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        switchInCurve: Curves.easeInOutQuad,
        child: _getViewForIndex(viewModel.currentIndex),
      ),
      bottomNavigationBar: Container(
        height: 110,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        decoration: const BoxDecoration(
          color: Color(0xFF121418),
          border: Border(
            top: BorderSide(
              color: Color(0xFF161F1E),
              width: 1,
            ),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(_navItems.length, (index) {
            final item = _navItems[index];
            final bool isActive = viewModel.currentIndex == index;

            return InkWell(
              onTap: () => viewModel.setIndex(index),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    padding: const EdgeInsets.all(10),
                    decoration: isActive
                        ? BoxDecoration(
                            color: const Color(0xFF121418),
                            borderRadius: BorderRadius.circular(32),
                            boxShadow: const [
                              // if you want inset shadows, use flutter_inset_box_shadow
                              BoxShadow(
                                color: Color(0xFF0F5951),
                                blurRadius: 12,
                                spreadRadius: -1,
                                offset: Offset(0, 1),
                                inset: true,
                              ),
                            ],
                          )
                        : null,
                    child: SvgPicture.asset(
                      item['icon']!,
                      width: 20,
                      height: 20,
                      colorFilter: ColorFilter.mode(
                        isActive
                            ? const Color(0xFF14F1D9) // active teal
                            : const Color(0xFFA3A9A6), // inactive grey
                        BlendMode.srcIn,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['label']!,
                    style: GoogleFonts.baloo2(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: isActive
                          ? const Color(0xFF14F1D9)
                          : const Color(0xFFA3A9A6),
                    ),
                  ),
                ],
              ),
            );
          }),
        ),
      ),
    );
  }

  Widget _getViewForIndex(int index) {
    switch (index) {
      case 0:
        return const HomeView();
      case 1:
        return const QuestsView();
      case 2:
        return const ChatsView();
      case 3:
        return const RoomsView();
      case 4:
        return const ProfileView();
      default:
        return const HomeView();
    }
  }

  @override
  BottomnavViewModel viewModelBuilder(BuildContext context) {
    final viewModel = BottomnavViewModel();
    // Set initial index if provided
    if (initialIndex != 0) {
      viewModel.setIndex(initialIndex);
    }
    return viewModel;
  }
}

/// NAV ITEMS CONFIG using your AppAssets
final List<Map<String, String>> _navItems = [
  {"icon": AppAssets.home, "label": "Home"},
  {"icon": AppAssets.quest, "label": "Quests"},
  {"icon": AppAssets.chat, "label": "Chats"},
  {"icon": AppAssets.room, "label": "Rooms"},
  {"icon": AppAssets.profile, "label": "Me"},
];
