import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:mobile/ui/views/mypage/mypage_view.dart';
import 'package:stacked/stacked.dart';

import 'home_viewmodel.dart';

class HomeView extends StackedView<HomeViewModel> {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget builder(BuildContext context, HomeViewModel viewModel, Widget? child) {
    return Scaffold(
        backgroundColor: const Color(0xFF121418),
        // We put the full screen content in a Stack so we can overlay the dim + stacked buttons
        body: Stack(
          children: [
            // ---------- main content (your original Column) ----------
            SafeArea(
              child: Column(
                children: [
                  // Top Header
                  _buildTopHeader(),
                  // Tab Selector
                  _buildTabSelector(viewModel),
                  // Content
                  Expanded(
                      child: viewModel.selectedTabIndex == 0
                          ? _buildFeedContent(viewModel)
                          : _buildFeedContent(viewModel)),
                ],
              ),
            ),
        
            // ---------- dim overlay (cover entire screen) ----------
            // We always include it but toggle its opacity and hit testing via IgnorePointer
            IgnorePointer(
              ignoring: !viewModel.showCreateOptions,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 220),
                opacity: viewModel.showCreateOptions ? 0.6 : 0.0,
                child: GestureDetector(
                  onTap: viewModel.toggleCreateOptions,
                  child: Container(
                    color: Colors.black,
                  ),
                ),
              ),
            ),
        
            // ---------- stacked buttons (right aligned above FAB) ----------
            // We use AnimatedPositioned + AnimatedOpacity so they animate in/out nicely
            // Create Post (upper)
            AnimatedPositioned(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOut,
              // when hidden, sit near the FAB (bottom 16) and fully transparent
              bottom: viewModel.showCreateOptions ? 90 : 16,
              right: 16,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 220),
                opacity: viewModel.showCreateOptions ? 1.0 : 0.0,
                child: _buildCreateRoomButton(() {
                  viewModel.createRoom();
                  viewModel.toggleCreateOptions();
                }),
              ),
            ),
        
            // Create Room (lower of the two)
            AnimatedPositioned(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOut,
              bottom: viewModel.showCreateOptions ? 25 : 16,
              right: 16,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 220),
                opacity: viewModel.showCreateOptions ? 1.0 : 0.0,
                child: _buildCreatePostButton(() {
                  viewModel.createPost();
                  viewModel.toggleCreateOptions();
                }),
              ),
            ),
          ],
        ),

        // ---------- FAB (keeps same look, toggles overlay) ----------
        floatingActionButton: viewModel.selectedTabIndex == 0
            ? _buildFloatingActionButton(viewModel)
            : _buildMyPageFloatingActionButton());
  }

  Widget _buildFeedContent(HomeViewModel viewModel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          const SizedBox(height: 24),
          // Feed Posts
          _buildFeedPost(),
          const SizedBox(height: 8),
          _buildFeedPost(),
          const SizedBox(height: 24),
          // Quest Card
          _buildQuestCard(viewModel),
          const SizedBox(height: 24),
          // More Posts
          _buildFeedPost(),
          const SizedBox(height: 8),
          _buildFeedPost(),
          const SizedBox(height: 8),
          _buildFeedPost(),
          const SizedBox(height: 120), // Space for bottom nav
        ],
      ),
    );
  }

  /// Top Header
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
            bottom: -2,
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

  Widget _buildTabSelector(HomeViewModel viewModel) {
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
                  'For You',
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
                  'Following',
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

  Widget _buildFeedPost() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        border: Border.all(color: const Color(0xFF181E1D)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(
              color: Colors.grey, // Placeholder for Checker.png
              borderRadius: BorderRadius.all(Radius.circular(16)),
            ),
          ),
          const SizedBox(width: 8),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name and time
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'SneakyWhisperer',
                        style: GoogleFonts.fredoka(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFFF1F7F6),
                        ),
                      ),
                    ),
                    Text(
                      '2m ago',
                      style: GoogleFonts.baloo2(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF3C4A47),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Post content
                Text(
                  'Tell me why I just saw SneakyParrot leaving the Secret Room at 3am 👀🔥',
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 12),
                // Interactions
                Row(
                  children: [
                    _buildInteractionButton(Icons.favorite_border, '24'),
                    const SizedBox(width: 24),
                    _buildInteractionButton(Icons.chat_bubble_outline, '24'),
                    const SizedBox(width: 24),
                    _buildInteractionButton(Icons.share, '24'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInteractionButton(IconData icon, String count) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: const Color(0xFF3C4A47),
        ),
        const SizedBox(width: 4),
        Text(
          count,
          style: GoogleFonts.baloo2(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF6B7A77),
          ),
        ),
      ],
    );
  }

  Widget _buildQuestCard(HomeViewModel viewModel) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF121A19),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Quest Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Drop 10 whispers in a room',
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
                const SizedBox(height: 6),
                // Progress bar
                Container(
                  height: 16,
                  decoration: BoxDecoration(
                    color: const Color(0xFF222A2A),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Stack(
                    children: [
                      Container(
                        width: 69,
                        height: 16,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF11998A), Color(0xFF48FFEB)],
                          ),
                          color: const Color(0xFF14F1D9),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0xFF11998A),
                              offset: Offset(-2, -4),
                              blurRadius: 6,
                              inset: true,
                            ),
                            BoxShadow(
                              color: Color(0xFF48FFEB),
                              offset: Offset(2, 4),
                              blurRadius: 4,
                              inset: true,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            '4/10',
                            style: GoogleFonts.fredoka(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF102E2B),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          // Reward
          Column(
            children: [
              Text(
                'REWARD',
                style: GoogleFonts.baloo2(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF6B7A77),
                ),
              ),
              const SizedBox(height: 4),
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [Color(0xFF14F1D9), Color(0xFFA0F9F1)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ).createShader(bounds),
                child: Text(
                  '30 XP',
                  style: GoogleFonts.fredoka(
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 20),
          // Go Button
          GestureDetector(
            onTap: () => viewModel.onQuestTap(),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F7F6),
                borderRadius: BorderRadius.circular(32),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0xFF222A2A),
                    offset: Offset(3, 3),
                  ),
                ],
              ),
              child: Text(
                'GO',
                style: GoogleFonts.fredoka(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF121418),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreateRoomButton(VoidCallback onTap) {
    // dark container with a dark inner circle icon (film/strip)
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF191E1D),
          borderRadius: BorderRadius.circular(32),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // small dark circle icon area
            Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF121418),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0xFF0F5951),
                      blurRadius: 12,
                      inset: true,
                    ),
                  ],
                ),
                child: SvgPicture.asset(
                  AppAssets.room,
                  color: const Color(0xFF14F1D9),
                  fit: BoxFit.none,
                )),
            const SizedBox(width: 12),
            Text(
              "Create Room",
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFF1F7F6),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreatePostButton(VoidCallback onTap) {
    // dark rounded container with glowing teal circle icon
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF191E1D),
          borderRadius: BorderRadius.circular(32),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // glowing teal circle
            Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF14F1D9),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: const [
                    BoxShadow(
                      color: Color.fromRGBO(20, 241, 217, 0.15),
                      offset: Offset(0, 4),
                      blurRadius: 10,
                    ),
                    BoxShadow(
                      color: Color(0xFF009282),
                      offset: Offset(0, -4),
                      blurRadius: 4,
                      inset: true,
                    ),
                  ],
                ),
                child: SvgPicture.asset(
                  AppAssets.add,
                  fit: BoxFit.none,
                )),
            const SizedBox(width: 12),
            Text(
              "Create Post",
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFF1F7F6),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFloatingActionButton(HomeViewModel viewModel) {
    if (viewModel.showCreateOptions) {
      return const SizedBox.shrink(); // hide button when overlay is open
    }

    return GestureDetector(
      onTap: viewModel.toggleCreateOptions,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: const Color(0xFF14F1D9),
          borderRadius: BorderRadius.circular(32),
          boxShadow: const [
            // outer shadow
            BoxShadow(
              color: Color.fromRGBO(20, 241, 217, 0.15),
              offset: Offset(0, 4),
              blurRadius: 10,
            ),
            // inner shadows (requires Flutter >=3.10 for inset)
            BoxShadow(
              color: Color(0xFF009282),
              offset: Offset(0, -4),
              blurRadius: 4,
              inset: true,
            ),
            BoxShadow(
              color: Color(0xFF85FFF2),
              offset: Offset(0, 6),
              blurRadius: 4,
              inset: true,
            ),
          ],
        ),
        child: Center(child: SvgPicture.asset(AppAssets.add, fit: BoxFit.none)),
      ),
    );
  }

  Widget _buildMyPageFloatingActionButton() {
    return GestureDetector(
      onTap: () {
        // Navigate to create post or show create options
        print("Create post from My Page");
      },
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: const Color(0xFF14F1D9),
          borderRadius: BorderRadius.circular(32),
          boxShadow: const [
            // outer shadow
            BoxShadow(
              color: Color.fromRGBO(20, 241, 217, 0.15),
              offset: Offset(0, 4),
              blurRadius: 10,
            ),
            // inner shadows (requires Flutter >=3.10 for inset)
            BoxShadow(
              color: Color(0xFF009282),
              offset: Offset(0, -4),
              blurRadius: 4,
              inset: true,
            ),
            BoxShadow(
              color: Color(0xFF85FFF2),
              offset: Offset(0, 6),
              blurRadius: 4,
              inset: true,
            ),
          ],
        ),
        child: Center(child: SvgPicture.asset(AppAssets.add, fit: BoxFit.none)),
      ),
    );
  }

  @override
  HomeViewModel viewModelBuilder(BuildContext context) => HomeViewModel();
}

class SegmentedRingPainter extends CustomPainter {
  final int totalSegments;
  final int filledSegments;

  SegmentedRingPainter({
    required this.totalSegments,
    required this.filledSegments,
  });

  @override
  void paint(Canvas canvas, Size size) {
    const strokeWidth = 2.8; // Smaller stroke for header
    final rect = Rect.fromLTWH(
      strokeWidth / 2,
      strokeWidth / 2,
      size.width - strokeWidth,
      size.height - strokeWidth,
    );

    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    // 1️⃣ Draw the filled background circle
    final backgroundPaint = Paint()
      ..style = PaintingStyle.fill
      ..color = const Color(0xFF121418); // Dark background inside
    canvas.drawCircle(center, radius, backgroundPaint);

    // 2️⃣ Draw the segmented ring on top
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    const gap = 0.30; // radians gap
    final sweep = (2 * 3.141592653589793) / totalSegments;
    const rotationOffset = 3.141592653589793 / 6.9;

    for (int i = 0; i < totalSegments; i++) {
      final startAngle = i * sweep + rotationOffset + gap / 2;
      final sweepAngle = sweep - gap;

      if (i < filledSegments) {
        if (i == filledSegments - 1) {
          // last filled arc gets gradient
          paint.shader = const LinearGradient(
                  colors: [Color(0xFF0F2823), Color(0xFF0F2823)])
              .createShader(rect);
        } else {
          // all other filled arcs get solid color
          paint.shader = null;
          paint.color = const Color(0xFF14F1D9);
        }
      } else {
        // unfilled arcs
        paint.shader = null;
        paint.color = const Color(0xFF0F2823);
      }

      canvas.drawArc(rect, startAngle, sweepAngle, false, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
