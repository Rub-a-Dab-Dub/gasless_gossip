import 'package:flutter/material.dart' hide BoxDecoration, BoxShadow;
import 'package:flutter_inset_shadow/flutter_inset_shadow.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/ui/common/app_assets.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:stacked/stacked.dart';

import 'chats_viewmodel.dart';

class ChatsView extends StackedView<ChatsViewModel> {
  const ChatsView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    ChatsViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF121418),
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            _buildTopHeader(viewModel),
            // Search Bar
            _buildSearchBar(viewModel),
            // Chats List
            Expanded(
              child: _buildChatsList(viewModel),
            ),
          ],
        ),
      ),
      floatingActionButton: _buildFloatingActionButton(),
    );
  }

  Widget _buildTopHeader(ChatsViewModel viewModel) {
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
          GestureDetector(
            onTap: viewModel.onSearchTap,
            child: SvgPicture.asset(AppAssets.search),
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

  Widget _buildSearchBar(ChatsViewModel viewModel) {
    return Container(
      height: 40,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF141817),
        border: Border.all(color: const Color(0xFF1D2120)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              onChanged: viewModel.onSearchChanged,
              style: GoogleFonts.baloo2(
                fontSize: 14,
                color: const Color(0xFFF1F7F6),
              ),
              decoration: InputDecoration(
                hintText: 'Search...',
                hintStyle: GoogleFonts.baloo2(
                  fontSize: 14,
                  color: const Color(0xFFA3A9A6),
                ),
                border: InputBorder.none,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: GestureDetector(
              onTap: viewModel.onSearchTap,
              child: Padding(
                padding: const EdgeInsets.all(9),
                child: SvgPicture.asset(AppAssets.search),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatsList(ChatsViewModel viewModel) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: viewModel.filteredChats.length,
      itemBuilder: (context, index) {
        final chat = viewModel.filteredChats[index];
        return _buildChatItem(chat, viewModel);
      },
    );
  }

  Widget _buildChatItem(ChatMessage chat, ChatsViewModel viewModel) {
    return InkWell(
      onTap: () => viewModel.onChatTap(chat),
      child: Container(
        height: 75,
        padding: const EdgeInsets.symmetric(vertical: 6), // reduced from 12
        child: Row(
          children: [
            // Avatar
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: const Color(0xFF2A3533),
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(
                  image: AssetImage(chat.avatarUrl),
                  fit: BoxFit.cover,
                  onError: (exception, stackTrace) {},
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Message Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    chat.userName,
                    style: GoogleFonts.fredoka(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFFF1F7F6),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      if (chat.isSentByMe) ...[
                        Icon(
                          Icons.done_all,
                          size: 14,
                          color: chat.isRead
                              ? const Color(0xFF7AF8EB)
                              : const Color(0xFFA3A9A6),
                        ),
                        const SizedBox(width: 4),
                      ],
                      Expanded(
                        child: Text(
                          chat.lastMessage,
                          style: GoogleFonts.fredoka(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFFA3A9A6),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Time and Unread Badge
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  chat.timestamp,
                  style: GoogleFonts.fredoka(
                    fontSize: 10,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF7C837F),
                  ),
                ),
                const SizedBox(height: 8),
                if (chat.unreadCount > 0)
                  Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      color: const Color(0xFF14F1D9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        '${chat.unreadCount}',
                        style: GoogleFonts.fredoka(
                          fontSize: 8,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF121418),
                        ),
                      ),
                    ),
                  )
                else
                  const SizedBox(width: 14, height: 14),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFloatingActionButton() {
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: const Color(0xFF14F1D9), // #14F1D9
        borderRadius: BorderRadius.circular(32),
        boxShadow: const [
          // outer shadow
          BoxShadow(
            color: Color.fromRGBO(20, 241, 217, 0.15),
            offset: Offset(0, 4),
            blurRadius: 10,
          ),
          // inner shadow effect (fake with spread)
          BoxShadow(
            color: Color(0xFF009282),
            offset: Offset(0, -4),
            blurRadius: 4,
            inset: true, // requires Flutter >=3.10 for `inset`
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
    );
  }

  @override
  ChatsViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      ChatsViewModel();
}
