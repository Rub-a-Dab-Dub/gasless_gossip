import 'package:mobile/ui/bottom_sheets/notice/notice_sheet.dart';
import 'package:mobile/ui/dialogs/info_alert/info_alert_dialog.dart';
import 'package:mobile/ui/views/home/home_view.dart';
import 'package:mobile/ui/views/startup/startup_view.dart';
import 'package:stacked/stacked_annotations.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:mobile/services/stellar_service.dart';
import 'package:mobile/ui/views/personal_chat_funding/personal_chat_funding_view.dart';
// @stacked-import

@StackedApp(
  routes: [
    MaterialRoute(page: HomeView),
    MaterialRoute(page: StartupView),
    MaterialRoute(page: PersonalChatFundingView),
    // @stacked-route
  ],
  dependencies: [
    LazySingleton(classType: BottomSheetService),
    LazySingleton(classType: DialogService),
    LazySingleton(classType: NavigationService),
    LazySingleton(classType: StellarService),
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
