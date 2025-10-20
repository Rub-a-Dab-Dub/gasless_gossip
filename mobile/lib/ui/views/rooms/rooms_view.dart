import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:stacked/stacked.dart';

import 'rooms_viewmodel.dart';

class RoomsView extends StackedView<RoomsViewModel> {
  const RoomsView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    RoomsViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            _buildTopHeader(),
            // Tab Selector
            _buildTabSelector(viewModel),
            // Filter Options
            _buildFilterOptions(viewModel),
            // Rooms List
            Expanded(
              child: _buildRoomsList(viewModel),
            ),
          ],
        ),
      ),
      floatingActionButton: _buildFloatingActionButton(viewModel),
    );
  }

  Widget _buildTopHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Avatar with XP - New Design
          _buildChickenAvatar(),
          // Logo
          SizedBox(
            width: 18,
            height: 32,
            child: Image.asset(AppAssets.logo),
          ),
          // Search Icon
          const Icon(
            Icons.search,
            color: Color(0xFFA3A9A6),
            size: 24,
          ),
        ],
      ),
    );
  }

  /// Chicken Avatar with XP Badge - Using SegmentedRingPainter
  Widget _buildChickenAvatar() {
    const ringSize = 36.0;
    return SizedBox(
      width: ringSize,
      height: 44, // taller because of XP badge below
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.topCenter, // 👈 ensures ring is centered at top
        children: [
          // SegmentedRingPainter circle
          CustomPaint(
            size: const Size(ringSize, ringSize),
            painter: SegmentedRingPainter(
              totalSegments: 3,
              filledSegments: 2,
            ),
          ),

          Stack(
            alignment: Alignment.center,
            children: [
              // Segmented ring on a perfect square
              CustomPaint(
                size: const Size.square(36), // same width & height
                painter: SegmentedRingPainter(
                  totalSegments: 3,
                  filledSegments: 2,
                ),
              ),

              // Chicken image centered inside
              SizedBox(
                width: 36 * 0.75, // 70% of ring size
                height: 36 * 0.75,
                child: ClipOval(
                  child: Image.asset(
                    AppAssets.eggshell,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ],
          ),

          // XP Badge at bottom
          Positioned(
            bottom:
                -2, // 👈 place below the ring instead of using hard top offset
            child: Container(
              width: 30,
              height: 15,
              decoration: BoxDecoration(
                color: const Color(0xFF0A2321),
                border: Border.all(color: const Color(0xFF033B36)),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Center(
                child: Text(
                  '120 XP',
                  style: GoogleFonts.baloo2(
                    fontSize: 8,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabSelector(RoomsViewModel viewModel) {
    return Container(
      height: 36,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFF131919), width: 1),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => viewModel.selectTab(0),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 4),
                decoration: BoxDecoration(
                  border: viewModel.selectedTabIndex == 0
                      ? const Border(
                          bottom:
                              BorderSide(color: Color(0xFF102E2B), width: 2),
                        )
                      : null,
                ),
                child: Text(
                  'All Rooms',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: viewModel.selectedTabIndex == 0
                        ? const Color(0xFF14F1D9)
                        : const Color(0xFFA3A9A6),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => viewModel.selectTab(1),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 4),
                decoration: BoxDecoration(
                  border: viewModel.selectedTabIndex == 1
                      ? const Border(
                          bottom:
                              BorderSide(color: Color(0xFF102E2B), width: 2),
                        )
                      : null,
                ),
                child: Text(
                  'My Rooms',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: viewModel.selectedTabIndex == 1
                        ? const Color(0xFF14F1D9)
                        : const Color(0xFFA3A9A6),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterOptions(RoomsViewModel viewModel) {
    return Container(
      height: 32,
      margin: const EdgeInsets.all(16),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: viewModel.filterOptions.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final isSelected = viewModel.selectedFilterIndex == index;
          return GestureDetector(
            onTap: () => viewModel.selectFilter(index),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFF2A3533)),
                borderRadius: BorderRadius.circular(8),
                color: isSelected ? const Color(0xFF2A3533) : null,
              ),
              child: Center(
                child: Text(
                  viewModel.filterOptions[index],
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: isSelected
                        ? const Color(0xFF14F1D9)
                        : const Color(0xFFA3A9A6),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRoomsList(RoomsViewModel viewModel) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: viewModel.rooms.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final room = viewModel.rooms[index];
        return _buildRoomCard(room, viewModel);
      },
    );
  }

  Widget _buildRoomCard(Room room, RoomsViewModel viewModel) {
    return GestureDetector(
      onTap: () => viewModel.onRoomTap(room),
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          color: const Color(0xFF131919),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            // Room Image
            Container(
              width: 116,
              height: 100,
              decoration: BoxDecoration(
                color: const Color(0xFF2A3533), // Placeholder color
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
                image: DecorationImage(
                  image: AssetImage(room.imageUrl),
                  fit: BoxFit.cover,
                  onError: (exception, stackTrace) {},
                ),
              ),
            ),
            // Room Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Room Info
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          room.name,
                          style: GoogleFonts.fredoka(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFFF1F7F6),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          room.description,
                          style: GoogleFonts.baloo2(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF6B7A77),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                    // Stats Row
                    Row(
                      children: [
                        // Member Avatars
                        _buildMemberAvatars(room),
                        const SizedBox(width: 8),
                        _buildDivider(),
                        const SizedBox(width: 8),
                        // Reactions
                        Row(
                          children: [
                            const Icon(
                              Icons.local_fire_department,
                              size: 16,
                              color: Color(0xFF9D0D08),
                            ),
                            const SizedBox(width: 2),
                            Text(
                              '${room.reactions}',
                              style: GoogleFonts.baloo2(
                                fontSize: 10,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFFAEB8B6),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(width: 8),
                        _buildDivider(),
                        const SizedBox(width: 8),
                        // Time Left
                        Row(
                          children: [
                            const Icon(
                              Icons.hourglass_bottom,
                              size: 14,
                              color: Color(0xFF09C0AC),
                            ),
                            const SizedBox(width: 2),
                            Text(
                              room.timeLeft,
                              style: GoogleFonts.baloo2(
                                fontSize: 10,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFFAEB8B6),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberAvatars(Room room) {
    return SizedBox(
      width: 52, // enough space for 3 avatars
      height: 20,
      child: Stack(
        children: [
          // First avatar
          if (room.memberAvatars.isNotEmpty)
            Positioned(
              left: 0,
              child: _buildAvatar(room.memberAvatars[0]),
            ),

          // Second avatar
          if (room.memberAvatars.length > 1)
            Positioned(
              left: 8,
              child: _buildAvatar(room.memberAvatars[1]),
            ),

          // Third avatar (with overlay count if needed)
          if (room.memberAvatars.length > 2)
            Positioned(
              left: 16,
              child: Stack(
                children: [
                  _buildAvatar(room.memberAvatars[2]),
                  if (room.memberCount > 3)
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: const Color(0xFF444444).withOpacity(0.65),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: Text(
                          '+${room.memberCount - 3}',
                          style: GoogleFonts.baloo2(
                            fontSize: 8,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFFF1F7F6),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildAvatar(String assetPath) {
    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        color: const Color(0xFF444444),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF444444), width: 2),
        image: DecorationImage(
          image: AssetImage(assetPath),
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 2,
      height: 16,
      decoration: BoxDecoration(
        color: const Color(0xFF232C2B),
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildFloatingActionButton(RoomsViewModel viewModel) {
    return GestureDetector(
      onTap: () {
        viewModel.createRoom();
      },
      child: Container(
        width: 173,
        height: 51,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(
              color: Color(0xFF0F5951),
              blurRadius: 12,
              spreadRadius: -1,
              offset: Offset(0, 1),
              inset: true,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Create New Room",
              style: GoogleFonts.fredoka(
                fontWeight: FontWeight.w500,
                fontSize: 14,
                height: 17 / 14,
                letterSpacing: -0.02,
                color: const Color(0xFF14F1D9),
              ),
            ),
            const Icon(
              Icons.arrow_forward,
              size: 24,
              color: Color(0xFF14F1D9),
            ),
          ],
        ),
      ),
    );
  }

  @override
  RoomsViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      RoomsViewModel();
}
