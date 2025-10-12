import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:stacked/stacked.dart';

import 'profile_viewmodel.dart';

class ProfileView extends StackedView<ProfileViewModel> {
  const ProfileView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    ProfileViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // Fixed Top Header (non-scrollable)
            _buildTopHeader(),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 2),
                child: Column(
                  children: [
                    // Profile Section
                    _buildProfileSection(viewModel),
                    const SizedBox(height: 32),
                    _buildQuestsSection(viewModel),
                    const SizedBox(height: 32),

                    // Content Section
                    _buildContentSection(viewModel),
                    const SizedBox(height: 120), // Space for bottom nav
                  ],
                ),
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

  // Main profile section (without quests)
  Widget _buildProfileSection(ProfileViewModel viewModel) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF14F1D9).withOpacity(0.02),
            offset: const Offset(0, 10),
            blurRadius: 12,
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // About User Section
          _buildAboutUserSection(viewModel),
          const SizedBox(height: 20),
          // Action Buttons
          _buildActionButtons(viewModel),
        ],
      ),
    );
  }

// Separate quests section
  Widget _buildQuestsSection(ProfileViewModel viewModel) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Quests Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Quests',
                style: GoogleFonts.fredoka(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFFAEB8B6),
                ),
              ),
              Text(
                'View All',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF0E9186),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Quest Cards Row - Horizontally Scrollable
          SizedBox(
            height: 93,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildQuestCardNew('Drop 10 whispers in a room', '30 XP'),
                const SizedBox(width: 8),
                _buildQuestCardNew('Comment in 8 rooms', '30 XP'),
                const SizedBox(width: 8),
                _buildQuestCardNew('Upload a post', '30 XP'),
                const SizedBox(width: 8),
                _buildQuestCardNew('Create a room for 1 hour', '30 XP'),
              ],
            ),
          ),
          const SizedBox(height: 18),
          // Pagination Dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: Color(0xFF0E9186),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: Color(0xFF191E1D),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: Color(0xFF191E1D),
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAboutUserSection(ProfileViewModel viewModel) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end, // align bottom together
      children: [
        // Avatar and Username
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Avatar
            Container(
              width: 64,
              height: 63,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: const DecorationImage(
                  image: AssetImage(AppAssets.profilepic),
                  fit: BoxFit.cover,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x55222A2A),
                    offset: Offset(3, 3),
                    blurRadius: 4,
                  ),
                ],
              ),
            ),
            // Username
            Text(
              'username',
              textAlign: TextAlign.center,
              style: GoogleFonts.baloo2(
                  fontSize: 8,
                  fontWeight: FontWeight.w400,
                  color: Colors.white),
            ),
          ],
        ),
        const SizedBox(width: 12),
        // Stats + Bio
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildStatsRow(),
              const SizedBox(height: 12),
              // Bio aligned with username
              Align(
                alignment: Alignment.bottomLeft,
                child: Text(
                  'artist.\namebo pro max',
                  style: GoogleFonts.baloo2(
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                      color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatsRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        _buildStatItem('POSTS', '3'),
        const SizedBox(width: 20),
        _buildStatItem('FOLLOWERS', '30'),
        const SizedBox(width: 20),
        _buildStatItem('FOLLOWING', '24'),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.baloo2(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF6B7A77),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.fredoka(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: const Color(0xFFF1F7F6),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(ProfileViewModel viewModel) {
    return Row(
      children: [
        // Edit Profile Button
        GestureDetector(
          onTap: () {
            viewModel.onEditProfile();
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1D22),
              borderRadius: BorderRadius.circular(32),
            ),
            child: Center(
              child: Text(
                'Edit Profile',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFD6D8D3),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        // Follow Button (Primary)
        Expanded(
          child: GestureDetector(
            onTap: () {
              viewModel.onWalletTap();
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Center(
                    child: Text(
                      'View Wallet',
                      style: GoogleFonts.baloo2(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF14F1D9),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.arrow_forward,
                    color: Color(0xFF14F1D9),
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildQuestCardNew(String title, String reward) {
    return Container(
      width: 185,
      height: 100,
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 16),
      decoration: BoxDecoration(
        color: const Color(0xFF121A19),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          // Quest Title
          Flexible(
            child: Align(
              alignment: Alignment.topLeft,
              child: Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Reward and Button Row
          SizedBox(
            width: 148,
            height: 34,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Reward Section
                Flexible(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'REWARD:',
                        style: GoogleFonts.baloo2(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF6B7A77),
                        ),
                      ),
                      //const SizedBox(height: 2),
                      ShaderMask(
                        shaderCallback: (bounds) => const LinearGradient(
                          colors: [Color(0xFF14F1D9), Color(0xFFA0F9F1)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ).createShader(bounds),
                        child: Text(
                          reward,
                          style: GoogleFonts.fredoka(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // GO Button
                Container(
                  width: 68,
                  height: 33,
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
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContentSection(ProfileViewModel viewModel) {
    return Column(
      children: [
        // Tab selector
        _buildContentTabSelector(viewModel),
        const SizedBox(height: 16),
        // Content based on selected tab
        _buildTabContent(viewModel),
      ],
    );
  }

  Widget _buildContentTabSelector(ProfileViewModel viewModel) {
    final tabs = [
      'Posts',
      'Rooms',
      'NFTS',
    ];

    return Container(
      height: 40,
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFF131919), width: 1),
        ),
      ),
      child: Row(
        children: tabs.asMap().entries.map((entry) {
          final index = entry.key;
          final title = entry.value;
          final isSelected = viewModel.selectedContentTab == index;

          return Expanded(
            child: GestureDetector(
              onTap: () => viewModel.selectContentTab(index),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
                decoration: BoxDecoration(
                  border: isSelected
                      ? const Border(
                          bottom:
                              BorderSide(color: Color(0xFF0E9186), width: 1),
                        )
                      : null,
                ),
                child: Text(
                  title,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.baloo2(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    color: isSelected
                        ? const Color(0xFFF1F7F6)
                        : const Color(0xFFA3A9A6),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTabContent(ProfileViewModel viewModel) {
    switch (viewModel.selectedContentTab) {
      case 0: // Posts
        return viewModel.hasUserPosts
            ? _buildPostsContent(viewModel)
            : _buildEmptyPostsContent(viewModel);
      case 1: // Rooms
        return _buildRoomsContent(viewModel);
      case 2: // NFTs
        return _buildNFTsContent(viewModel);
      default:
        return _buildEmptyPostsContent(viewModel);
    }
  }

  Widget _buildEmptyPostsContent(ProfileViewModel viewModel) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 32, 16, 32),
      decoration: BoxDecoration(
        color: const Color(0xFF121418),
        border: Border.all(color: const Color(0xFF181E1D)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          // Empty state text
          Column(
            children: [
              Text(
                'No post has been made yet',
                style: GoogleFonts.fredoka(
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFF1F7F6),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Create your first post to get started',
                style: GoogleFonts.baloo2(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFFA3A9A6),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Create new post Button
          GestureDetector(
            onTap: () => viewModel.simulateUserPost(),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 16),
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
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Create New Posts',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.fredoka(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF14F1D9),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.arrow_forward,
                    color: Color(0xFF14F1D9),
                    size: 24,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostsContent(ProfileViewModel viewModel) {
    return Column(
      children: [
        // User's posts
        _buildUserPost(),
        const SizedBox(height: 8),
        _buildUserPost(),
        const SizedBox(height: 8),
        _buildUserPost(),
      ],
    );
  }

  Widget _buildRoomsContent(ProfileViewModel viewModel) {
    if (viewModel.userRooms.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          border: Border.all(color: const Color(0xFF181E1D)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              'No rooms created yet',
              style: GoogleFonts.fredoka(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFF1F7F6),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first room to get started',
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFA3A9A6),
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: viewModel.userRooms
          .map((room) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _buildRoomCard(room),
              ))
          .toList(),
    );
  }

  Widget _buildNFTsContent(ProfileViewModel viewModel) {
    if (viewModel.userNFTs.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: const Color(0xFF121418),
          border: Border.all(color: const Color(0xFF181E1D)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              'No NFTs owned yet',
              style: GoogleFonts.fredoka(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFF1F7F6),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Start collecting NFTs to see them here',
              style: GoogleFonts.baloo2(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFA3A9A6),
              ),
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 4,
        mainAxisSpacing: 4,
        childAspectRatio: 1.5,
      ),
      itemCount: viewModel.userNFTs.length,
      itemBuilder: (context, index) {
        final nft = viewModel.userNFTs[index];
        return _buildNFTCard(nft);
      },
    );
  }

  Widget _buildUserPost() {
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
                    const SizedBox(width: 12),
                    const Icon(
                      Icons.more_vert,
                      color: Color(0xFFA3A9A6),
                      size: 24,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Post content
                Text(
                  'Did you hear about the drama at the coffee shop? The barista and the manager got into a heated arguement',
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
          style: GoogleFonts.fredoka(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF6B7A77),
          ),
        ),
      ],
    );
  }

  Widget _buildRoomCard(Room room) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: const Color(0xFF131919),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Room Image
          Container(
            width: 116,
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFF2A3533),
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
    );
  }

  Widget _buildMemberAvatars(Room room) {
    return SizedBox(
      width: 52,
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

  Widget _buildNFTCard(NFT nft) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131919),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF181E1D)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // NFT Image
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF2A3533),
                borderRadius: const BorderRadius.only(
                    //topLeft: Radius.circular(12),
                    //topRight: Radius.circular(12),

                    ),
                image: DecorationImage(
                  image: AssetImage(nft.imageUrl),
                  fit: BoxFit.cover,
                  onError: (exception, stackTrace) {},
                ),
              ),
            ),
          ),
          // NFT Info
        ],
      ),
    );
  }

  @override
  ProfileViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      ProfileViewModel();
}
