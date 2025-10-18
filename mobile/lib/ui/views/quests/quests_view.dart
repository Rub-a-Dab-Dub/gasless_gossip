import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:stacked/stacked.dart';

import '../home/home_view.dart';
import 'quests_viewmodel.dart';

class QuestsView extends StackedView<QuestsViewModel> {
  const QuestsView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    QuestsViewModel viewModel,
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
            // Content
            Expanded(
              child: SingleChildScrollView(
                child: viewModel.selectedTabIndex == 0
                    ? _buildMyStatsContent(viewModel)
                    : _buildLeaderboardContent(viewModel),
              ),
            ),
          ],
        ),
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

  Widget _buildTabSelector(QuestsViewModel viewModel) {
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
                  'My Stats',
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
                  'Leaderboard',
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

  Widget _buildXPBalanceCard(QuestsViewModel viewModel) {
    return Container(
      width: double.infinity,
      height: 75,
      margin: const EdgeInsets.symmetric(horizontal: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0A2321),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // XP Section
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'XP',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF0E9186),
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFF033B36)),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Center(
                      child: SizedBox(
                        width: 8,
                        height: 10,
                        child: Image.asset(AppAssets.xp),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${viewModel.currentXP}',
                    style: GoogleFonts.fredoka(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFFF1F7F6),
                    ),
                  ),
                ],
              ),
            ],
          ),
          // Balance Section
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Balance',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF0E9186),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${viewModel.balance}M',
                style: GoogleFonts.fredoka(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCharacterAvatar(QuestsViewModel viewModel) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Stack(
          alignment: Alignment.center,
          clipBehavior: Clip.none,
          children: [
            // The segmented ring
            CustomPaint(
              size: const Size(120, 120),
              painter: BigSegmentedRingPainter(
                totalSegments: viewModel.maxLevelProgress,
                filledSegments: viewModel.levelProgress,
              ),
            ),

            // 👇 Center content inside the circle
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'lvl',
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
                Text(
                  '${viewModel.userLevel}',
                  style: GoogleFonts.fredoka(
                    fontSize: 48,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFFF1F7F6),
                    height: 0.8,
                  ),
                ),
              ],
            ),

            // Progress badge at the bottom of the circle
            Positioned(
              bottom: -8,
              left: 38,
              child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 11, vertical: 1),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0A2321),
                    border: Border.all(color: const Color(0xFF033B36)),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: '${viewModel.levelProgress}', // first part
                          style: GoogleFonts.baloo2(
                            fontSize: 12,
                            fontWeight: FontWeight.w500, // e.g. bold
                            color: const Color(0xFFF1F7F6),
                          ),
                        ),
                        TextSpan(
                          text: '/${viewModel.maxLevelProgress}', // second part
                          style: GoogleFonts.baloo2(
                            fontSize: 12,
                            fontWeight: FontWeight.w500, // e.g. lighter
                            color: const Color(0xFF9AA0A6), // different color
                          ),
                        ),
                      ],
                    ),
                  )),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Character image
        Padding(
          padding: const EdgeInsets.only(left: 18),
          child: SizedBox(
              width: 300, height: 208, child: Image.asset(AppAssets.eggshell)),
        ),
      ],
    );
  }

  Widget _buildDailyCheckIn(QuestsViewModel viewModel) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start, // 🔑 align tops together
      children: viewModel.dailyCheckIns.map((checkIn) {
        if (checkIn.isCompleted) {
          // ✅ Active day → hexagon/badge shape (white)
          return Container(
            width: 42,
            height: 40,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            child: CustomPaint(
              painter: _DailyCheckInPainter(),
              child: Center(
                child: Text(
                  '${checkIn.day}',
                  style: GoogleFonts.fredoka(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF121418),
                  ),
                ),
              ),
            ),
          );
        } else {
          // ❌ Inactive day → dark rectangle
          return Container(
            width: 40,
            height: 28,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: const BoxDecoration(
              color: Color(0xFF151D1D),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(6),
                bottomRight: Radius.circular(6),
              ),
              boxShadow: [
                BoxShadow(
                  color: Color(0xFF0C1010),
                  offset: Offset(3, 3),
                  blurRadius: 0,
                  spreadRadius: 0,
                ),
              ],
            ),
            child: Center(
              child: Text(
                '${checkIn.day}',
                style: GoogleFonts.fredoka(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF3C4A47),
                ),
              ),
            ),
          );
        }
      }).toList(),
    );
  }

  Widget _buildQuestCard(Quest quest, QuestsViewModel viewModel) {
    const trackWidth = 193.0;
    const trackHeight = 16.0;

    return Container(
      width: double.infinity,
      height: 76,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
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
                  quest.title,
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
                const SizedBox(height: 6),
                // Progress Bar
                Container(
                  width: trackWidth,
                  height: trackHeight,
                  decoration: BoxDecoration(
                    color: const Color(0xFF222A2A),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Stack(
                    children: [
                      Container(
                        width: trackWidth * quest.progressPercentage,
                        height: trackHeight,
                        decoration: BoxDecoration(
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
                        alignment: Alignment.center,
                        child: Text(
                          '${quest.currentProgress}/${quest.totalProgress}',
                          style: GoogleFonts.fredoka(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF102E2B),
                            height: 1.2,
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
            mainAxisAlignment: MainAxisAlignment.center,
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
                  '${quest.rewardXP} XP',
                  style: GoogleFonts.fredoka(
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                    height: 0.7,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 20),
          // Go Button
          GestureDetector(
            onTap: () => viewModel.onQuestTap(quest),
            child: Container(
              width: 44,
              height: 41,
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
              child: Center(
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
          ),
        ],
      ),
    );
  }

  /// Today's Task Section
  Widget _buildTodaysTaskSection(QuestsViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            "today's Task",
            style: GoogleFonts.fredoka(
              fontSize: 20,
              fontWeight: FontWeight.w500,
              color: const Color(0xFFD6D8D3),
            ),
          ),
          const SizedBox(height: 24),
          // Task Cards
          Column(
            children: viewModel.todayTasks.map((task) {
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                child: _buildTodayTaskCard(task, viewModel),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  /// Today's Task Card
  Widget _buildTodayTaskCard(TodayTask task, QuestsViewModel viewModel) {
    return Container(
      width: double.infinity,
      height: 88,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1D22),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Image with reward badge
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: const Color(0xFF2A2D32),
              borderRadius: BorderRadius.circular(8),
              image: const DecorationImage(
                image: AssetImage(AppAssets.image9),
                fit: BoxFit.cover,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  width: double.infinity,
                  height: 19,
                  decoration: const BoxDecoration(
                    color: Color(0xFF121418),
                  ),
                  child: Center(
                    child: Text(
                      '${task.rewardXP} XP',
                      style: GoogleFonts.fredoka(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF14F1D9),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Texts
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  task.title,
                  style: GoogleFonts.fredoka(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  task.description,
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Tracker and Button
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Tracker
              Text(
                '${task.currentProgress}/${task.totalProgress}',
                style: GoogleFonts.fredoka(
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFD6FFF6),
                ),
              ),
              const SizedBox(height: 6),
              // GO Button
              Container(
                width: 70,
                height: 42,
                decoration: BoxDecoration(
                  color: const Color(0xFF102E2B),
                  border: Border.all(color: const Color(0xFF0F443E)),
                  borderRadius: BorderRadius.circular(32),
                ),
                child: Center(
                  child: Text(
                    'GO',
                    style: GoogleFonts.baloo2(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF14F1D9),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Quests and Referral Section
  Widget _buildQuestsAndReferralSection(QuestsViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Quests Container
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(24, 32, 24, 32),
            decoration: BoxDecoration(
              color: const Color(0xFF121418),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(32),
                topRight: Radius.circular(32),
                bottomLeft: Radius.circular(4),
                bottomRight: Radius.circular(4),
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF1FF4DD).withOpacity(0.11),
                  blurRadius: 24,
                  inset: true,
                ),
              ],
            ),
            child: Column(
              children: [
                // Title
                Text(
                  'Quests',
                  style: GoogleFonts.fredoka(
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF14F1D9),
                  ),
                ),
                const SizedBox(height: 24),
                // Quest Cards
                Column(
                  children: viewModel.quests.map((quest) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: _buildQuestCard(quest, viewModel),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          SizedBox(height: 10),
          // Referral Section
          _buildReferralSection(viewModel),
        ],
      ),
    );
  }

  /// Referral Section
  Widget _buildReferralSection(QuestsViewModel viewModel) {
    final referral = viewModel.referralInfo;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
          topLeft: Radius.circular(4),
          topRight: Radius.circular(4),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF14F1D9).withOpacity(0.06),
            blurRadius: 12,
            inset: true,
          ),
        ],
      ),
      child: Row(
        children: [
          // Referral Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Refer 5 people, earn ${referral.rewardXP}XP',
                  style: GoogleFonts.baloo2(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFF1F7F6),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${referral.currentReferrals}/${referral.targetReferrals}',
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA3A9A6),
                  ),
                ),
              ],
            ),
          ),
          // Referral Code
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'referral code',
                style: GoogleFonts.baloo2(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                ),
              ),
              const SizedBox(height: 3),
              Row(
                children: [
                  Text(
                    referral.referralCode,
                    style: GoogleFonts.baloo2(
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFF1F7F6),
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
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMyStatsContent(QuestsViewModel viewModel) {
    return Column(
      children: [
        const SizedBox(height: 25),
        // XP and Balance Card
        Stack(
          clipBehavior: Clip.none,
          children: [
            // XP/Balance Card
            _buildXPBalanceCard(viewModel),

            // Character Avatar overlapping slightly
            Positioned(
              top: 20,
              left: 0,
              right: 0,
              child: Center(
                child: _buildCharacterAvatar(viewModel),
              ),
            ),
          ],
        ),
        const SizedBox(height: 280),
        // Daily Check-in
        _buildDailyCheckIn(viewModel),
        const SizedBox(height: 32),
        // Today's Task Section
        _buildTodaysTaskSection(viewModel),
        const SizedBox(height: 32),
        // Quests and Referral Section
        _buildQuestsAndReferralSection(viewModel),
        const SizedBox(height: 100), // Space for bottom nav
      ],
    );
  }

// STEP 3: Add this new method for Leaderboard content
// Add this method to your QuestsView class:
  Widget _buildLeaderboardContent(QuestsViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          const SizedBox(height: 40),

          // Filter Options
          _buildFilterOptions(viewModel),

          const SizedBox(height: 40),

          // Top 3 Podium
          _buildTop3Podium(viewModel),

          const SizedBox(height: 40),

          // User Score Info Card
          _buildUserScoreCard(viewModel),

          const SizedBox(height: 100), // Space for bottom nav
        ],
      ),
    );
  }

// STEP 4: Add these new methods to your QuestsView class:

  Widget _buildFilterOptions(QuestsViewModel viewModel) {
    return SizedBox(
      height: 48,
      child: Row(
        children: [
          Expanded(
            child: _buildFilterOption(
                'Today', viewModel.selectedFilter == 'Today', () {
              viewModel.setSelectedFilter('Today');
            }),
          ),
          Expanded(
            child: _buildFilterOption(
                'Week', viewModel.selectedFilter == 'Week', () {
              viewModel.setSelectedFilter('Week');
            }),
          ),
          Expanded(
            child: _buildFilterOption(
                'Month', viewModel.selectedFilter == 'Month', () {
              viewModel.setSelectedFilter('Month');
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterOption(String text, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        margin: const EdgeInsets.symmetric(horizontal: 1),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF102E2B) : Colors.transparent,
          border: Border.all(color: const Color(0xFF161F1E)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(
          child: Text(
            text,
            style: GoogleFonts.baloo2(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: isSelected
                  ? const Color(0xFF14F1D9)
                  : const Color(0xFFD6D8D3),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTop3Podium(QuestsViewModel viewModel) {
    return Container(
      height: 320,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF0B1111),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF19F1DA).withOpacity(0.12),
            blurRadius: 24,
            inset: true,
          ),
        ],
      ),
      child: Row(
        children: [
          // 3rd Place (Left)
          Expanded(
            child: _buildPodiumProfile(
              imagePath: AppAssets.image12,
              name: 'Mikkey',
              xp: '387 XP',
              rank: '#3',
              height: 87,
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFF18314), Color(0xFFFFAC5A)],
              ),
              badgeColor: const Color(0xFF3E2103),
              borderColor: const Color(0xFFBB620B),
              rankColor: const Color(0xFFBB620B),
            ),
          ),
          const SizedBox(width: 12),

          // 1st Place (Center)
          Expanded(
            child: _buildPodiumProfile(
              imagePath: AppAssets.image11,
              name: 'Mikkey',
              xp: '700 XP',
              rank: '#1',
              height: 152,
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF14F1D9), Color(0xFFA0F9F1)],
              ),
              badgeColor: const Color(0xFF004C45),
              borderColor: const Color(0xFF0E9186),
              rankColor: const Color(0xFF0E9186),
              showTrophy: true,
            ),
          ),
          const SizedBox(width: 12),

          // 2nd Place (Right)
          Expanded(
            child: _buildPodiumProfile(
              imagePath: AppAssets.image10,
              name: 'Mikkey',
              xp: '562 XP',
              rank: '#2',
              height: 108,
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF9914F1), Color(0xFFC977FF)],
              ),
              badgeColor: const Color(0xFF3F0269),
              borderColor: const Color(0xFF7511B8),
              rankColor: const Color(0xFF7511B8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPodiumProfile({
    required String name,
    required String xp,
    required String rank,
    required double height,
    required Gradient gradient,
    required Color badgeColor,
    required Color borderColor,
    required Color rankColor,
    required String imagePath,
    bool showTrophy = false,
  }) {
    return Column(
      children: [
        // Avatar and Name
        Column(
          children: [
            Container(
              width: 48,
              height: 48,
              child: Image.asset(imagePath),
            ),
            const SizedBox(height: 4),
            Text(
              name,
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFF1F7F6),
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Height Container
        Expanded(
          child: Container(
            width: 95.33,
            decoration: BoxDecoration(
              color: const Color(0xFFD9D9D9),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                // Level Container
                Container(
                  width: double.infinity,
                  height: height,
                  decoration: BoxDecoration(
                    gradient: gradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // XP Badge
                      Container(
                        height: 26,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 4, vertical: 0),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          border: Border.all(color: borderColor, width: 4),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Center(
                          child: Text(
                            xp,
                            style: GoogleFonts.fredoka(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFFF1F7F6),
                            ),
                          ),
                        ),
                      ),

                      // Trophy or Rank
                      if (showTrophy) ...[
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: const Color(0xFF12EAD3),
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: const Icon(
                            Icons.emoji_events_outlined,
                            color: Color(0xFF0E9186),
                            size: 20,
                          ),
                        ),
                      ] else ...[
                        const SizedBox(height: 8),
                      ],

                      // Rank Number
                      Text(
                        rank,
                        style: GoogleFonts.fredoka(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: rankColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUserScoreCard(QuestsViewModel viewModel) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF121A19),
        border: Border.all(color: const Color(0xFF102E2B), width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ⭐ Star icon
          const Icon(
            Icons.star_half,
            color: Color(0xFF7AF8EB),
            size: 26,
          ),

          const SizedBox(width: 16),

          // Texts
          Expanded(
            // 👈 this prevents horizontal overflow
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // First Row (Score + XP)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Your Score:",
                      style: GoogleFonts.fredoka(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        height: 19 / 16,
                        color: const Color(0xFFF1F7F6),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      "20 XP",
                      style: GoogleFonts.fredoka(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        height: 19 / 16,
                        color: const Color(0xFF14F1D9),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                // Description
                Text(
                  "A few more points will get you to the top.\nKEEP IT UP!",
                  style: GoogleFonts.baloo2(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    height: 18 / 12,
                    color: const Color(0xFFD6D8D3),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  QuestsViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      QuestsViewModel();
}

class BigSegmentedRingPainter extends CustomPainter {
  final int totalSegments;
  final int filledSegments;

  BigSegmentedRingPainter({
    required this.totalSegments,
    required this.filledSegments,
  });

  @override
  void paint(Canvas canvas, Size size) {
    const strokeWidth = 9.5;
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
      ..color =
          const Color(0xFF121418); // change this to your desired inside color
    canvas.drawCircle(center, radius, backgroundPaint);

    // 2️⃣ Draw the segmented ring on top
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    const gap = 0.25; // radians gap
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

class _DailyCheckInPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white // active background
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, 0); // top-left
    path.lineTo(size.width, 0); // top-right
    path.lineTo(size.width, size.height * 0.8); // right slope
    path.lineTo(size.width / 2, size.height); // bottom point
    path.lineTo(0, size.height * 0.8); // left slope
    path.close();

    // fill shape
    canvas.drawPath(path, paint);

    // sharp shadow like CSS
    ///canvas.drawShadow(path, const Color(0xFF151D1D), 3, false);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
