import 'package:mobile/ui/bottom_sheets/notice/notice_sheet.dart';
import 'package:mobile/ui/dialogs/info_alert/info_alert_dialog.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:mobile/ui/views/startup/startup_view.dart';
import 'package:stacked/stacked_annotations.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/ui/views/signup/signup_view.dart';
import 'package:mobile/ui/views/signin/signin_view.dart';
import 'package:mobile/ui/views/bottomnav/bottomnav_view.dart';
import 'package:mobile/ui/views/quests/quests_view.dart';
import 'package:mobile/ui/views/chats/chats_view.dart';
import 'package:mobile/ui/views/rooms/rooms_view.dart';
import 'package:mobile/ui/views/profile/profile_view.dart';
import 'package:mobile/ui/views/chatroom/chatroom_view.dart';
import 'package:mobile/ui/views/createroom/createroom_view.dart';
import 'package:mobile/ui/views/createpost/createpost_view.dart';
import 'package:mobile/ui/views/mypage/mypage_view.dart';
import 'package:mobile/ui/views/wallet/wallet_view.dart';
import 'package:mobile/ui/views/createroom/uploadavatar/uploadavatar_view.dart';
import 'package:mobile/ui/views/send/send_view.dart';
import 'package:mobile/ui/views/swap/swap_view.dart';
import 'package:mobile/ui/views/send/send_view.dart';
import 'package:mobile/ui/views/signup_successful/signup_successful_view.dart';
import 'package:mobile/ui/views/receive_scan/receive_scan_view.dart';
// @stacked-import

@StackedApp(
  routes: [
    MaterialRoute(page: HomeView),
    MaterialRoute(page: StartupView),
    MaterialRoute(page: SignupView),
    MaterialRoute(page: SigninView),
    MaterialRoute(page: BottomnavView),
    MaterialRoute(page: QuestsView),
    MaterialRoute(page: ChatsView),
    MaterialRoute(page: RoomsView),
    MaterialRoute(page: ProfileView),
    MaterialRoute(page: ChatroomView),
    MaterialRoute(page: CreateroomView),
    MaterialRoute(page: CreatepostView),
    MaterialRoute(page: MyPageView),
    MaterialRoute(page: WalletView),
    MaterialRoute(page: UploadavatarView),
    MaterialRoute(page: SendView),
    MaterialRoute(page: SwapView),
    MaterialRoute(page: SendView),
    MaterialRoute(page: SignupSuccessfulView),
    MaterialRoute(page: ReceiveScanView),
// @stacked-route
  ],
  dependencies: [
    LazySingleton(classType: BottomSheetService),
    LazySingleton(classType: DialogService),
    LazySingleton(classType: NavigationService),
    // @stacked-service
  ],
  bottomsheets: [
    StackedBottomsheet(classType: NoticeSheet),
    // @stacked-bottom-sheet
  ],
  dialogs: [
    StackedDialog(classType: InfoAlertDialog),
    // @stacked-dialog
  ],
)
class App {}
