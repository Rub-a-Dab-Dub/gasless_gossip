// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// StackedNavigatorGenerator
// **************************************************************************

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:flutter/material.dart' as _i19;
import 'package:flutter/material.dart';
import 'package:mobile/ui/views/bottomnav/bottomnav_view.dart' as _i6;
import 'package:mobile/ui/views/chatroom/chatroom_view.dart' as _i11;
import 'package:mobile/ui/views/chatroom/chatroom_viewmodel.dart' as _i20;
import 'package:mobile/ui/views/chats/chats_view.dart' as _i8;
import 'package:mobile/ui/views/createpost/createpost_view.dart' as _i13;
import 'package:mobile/ui/views/createroom/createroom_view.dart' as _i12;
import 'package:mobile/ui/views/createroom/uploadavatar/uploadavatar_view.dart'
    as _i17;
import 'package:mobile/ui/views/home/home_view.dart' as _i2;
import 'package:mobile/ui/views/mypage/mypage_view.dart' as _i14;
import 'package:mobile/ui/views/postsuccess/postsuccess_view.dart' as _i15;
import 'package:mobile/ui/views/profile/profile_view.dart' as _i10;
import 'package:mobile/ui/views/quests/quests_view.dart' as _i7;
import 'package:mobile/ui/views/rooms/rooms_view.dart' as _i9;
import 'package:mobile/ui/views/send/send_view.dart' as _i18;
import 'package:mobile/ui/views/signin/signin_view.dart' as _i5;
import 'package:mobile/ui/views/signup/signup_view.dart' as _i4;
import 'package:mobile/ui/views/startup/startup_view.dart' as _i3;
import 'package:mobile/ui/views/wallet/wallet_view.dart' as _i16;
import 'package:stacked/stacked.dart' as _i1;
import 'package:stacked_services/stacked_services.dart' as _i21;

class Routes {
  static const homeView = '/home-view';

  static const startupView = '/startup-view';

  static const signupView = '/signup-view';

  static const signinView = '/signin-view';

  static const bottomnavView = '/bottomnav-view';

  static const questsView = '/quests-view';

  static const chatsView = '/chats-view';

  static const roomsView = '/rooms-view';

  static const profileView = '/profile-view';

  static const chatroomView = '/chatroom-view';

  static const createroomView = '/createroom-view';

  static const createpostView = '/createpost-view';

  static const myPageView = '/my-page-view';

  static const postsuccessView = '/postsuccess-view';

  static const walletView = '/wallet-view';

  static const uploadavatarView = '/uploadavatar-view';

  static const sendView = '/send-view';

  static const all = <String>{
    homeView,
    startupView,
    signupView,
    signinView,
    bottomnavView,
    questsView,
    chatsView,
    roomsView,
    profileView,
    chatroomView,
    createroomView,
    createpostView,
    myPageView,
    postsuccessView,
    walletView,
    uploadavatarView,
    sendView,
  };
}

class StackedRouter extends _i1.RouterBase {
  final _routes = <_i1.RouteDef>[
    _i1.RouteDef(
      Routes.homeView,
      page: _i2.HomeView,
    ),
    _i1.RouteDef(
      Routes.startupView,
      page: _i3.StartupView,
    ),
    _i1.RouteDef(
      Routes.signupView,
      page: _i4.SignupView,
    ),
    _i1.RouteDef(
      Routes.signinView,
      page: _i5.SigninView,
    ),
    _i1.RouteDef(
      Routes.bottomnavView,
      page: _i6.BottomnavView,
    ),
    _i1.RouteDef(
      Routes.questsView,
      page: _i7.QuestsView,
    ),
    _i1.RouteDef(
      Routes.chatsView,
      page: _i8.ChatsView,
    ),
    _i1.RouteDef(
      Routes.roomsView,
      page: _i9.RoomsView,
    ),
    _i1.RouteDef(
      Routes.profileView,
      page: _i10.ProfileView,
    ),
    _i1.RouteDef(
      Routes.chatroomView,
      page: _i11.ChatroomView,
    ),
    _i1.RouteDef(
      Routes.createroomView,
      page: _i12.CreateroomView,
    ),
    _i1.RouteDef(
      Routes.createpostView,
      page: _i13.CreatepostView,
    ),
    _i1.RouteDef(
      Routes.myPageView,
      page: _i14.MyPageView,
    ),
    _i1.RouteDef(
      Routes.postsuccessView,
      page: _i15.PostsuccessView,
    ),
    _i1.RouteDef(
      Routes.walletView,
      page: _i16.WalletView,
    ),
    _i1.RouteDef(
      Routes.uploadavatarView,
      page: _i17.UploadavatarView,
    ),
    _i1.RouteDef(
      Routes.sendView,
      page: _i18.SendView,
    ),
  ];

  final _pagesMap = <Type, _i1.StackedRouteFactory>{
    _i2.HomeView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i2.HomeView(),
        settings: data,
      );
    },
    _i3.StartupView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i3.StartupView(),
        settings: data,
      );
    },
    _i4.SignupView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i4.SignupView(),
        settings: data,
      );
    },
    _i5.SigninView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i5.SigninView(),
        settings: data,
      );
    },
    _i6.BottomnavView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i6.BottomnavView(),
        settings: data,
      );
    },
    _i7.QuestsView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i7.QuestsView(),
        settings: data,
      );
    },
    _i8.ChatsView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i8.ChatsView(),
        settings: data,
      );
    },
    _i9.RoomsView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i9.RoomsView(),
        settings: data,
      );
    },
    _i10.ProfileView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i10.ProfileView(),
        settings: data,
      );
    },
    _i11.ChatroomView: (data) {
      final args = data.getArgs<ChatroomViewArguments>(
        orElse: () => const ChatroomViewArguments(),
      );
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) =>
            _i11.ChatroomView(chatUser: args.chatUser, key: args.key),
        settings: data,
      );
    },
    _i12.CreateroomView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i12.CreateroomView(),
        settings: data,
      );
    },
    _i13.CreatepostView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i13.CreatepostView(),
        settings: data,
      );
    },
    _i14.MyPageView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i14.MyPageView(),
        settings: data,
      );
    },
    _i15.PostsuccessView: (data) {
      final args = data.getArgs<PostsuccessViewArguments>(
        orElse: () => const PostsuccessViewArguments(),
      );
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) =>
            _i15.PostsuccessView(key: args.key, xpEarned: args.xpEarned),
        settings: data,
      );
    },
    _i16.WalletView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i16.WalletView(),
        settings: data,
      );
    },
    _i17.UploadavatarView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i17.UploadavatarView(),
        settings: data,
      );
    },
    _i18.SendView: (data) {
      return _i19.MaterialPageRoute<dynamic>(
        builder: (context) => const _i18.SendView(),
        settings: data,
      );
    },
  };

  @override
  List<_i1.RouteDef> get routes => _routes;

  @override
  Map<Type, _i1.StackedRouteFactory> get pagesMap => _pagesMap;
}

class ChatroomViewArguments {
  const ChatroomViewArguments({
    this.chatUser,
    this.key,
  });

  final _i20.ChatUser? chatUser;

  final _i19.Key? key;

  @override
  String toString() {
    return '{"chatUser": "$chatUser", "key": "$key"}';
  }

  @override
  bool operator ==(covariant ChatroomViewArguments other) {
    if (identical(this, other)) return true;
    return other.chatUser == chatUser && other.key == key;
  }

  @override
  int get hashCode {
    return chatUser.hashCode ^ key.hashCode;
  }
}

class PostsuccessViewArguments {
  const PostsuccessViewArguments({
    this.key,
    this.xpEarned = 30,
  });

  final _i19.Key? key;

  final int xpEarned;

  @override
  String toString() {
    return '{"key": "$key", "xpEarned": "$xpEarned"}';
  }

  @override
  bool operator ==(covariant PostsuccessViewArguments other) {
    if (identical(this, other)) return true;
    return other.key == key && other.xpEarned == xpEarned;
  }

  @override
  int get hashCode {
    return key.hashCode ^ xpEarned.hashCode;
  }
}

extension NavigatorStateExtension on _i21.NavigationService {
  Future<dynamic> navigateToHomeView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.homeView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToStartupView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.startupView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToSignupView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.signupView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToSigninView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.signinView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToBottomnavView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.bottomnavView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToQuestsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.questsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToChatsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.chatsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToRoomsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.roomsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToProfileView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.profileView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToChatroomView({
    _i20.ChatUser? chatUser,
    _i19.Key? key,
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  }) async {
    return navigateTo<dynamic>(Routes.chatroomView,
        arguments: ChatroomViewArguments(chatUser: chatUser, key: key),
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToCreateroomView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.createroomView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToCreatepostView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.createpostView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToMyPageView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.myPageView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToPostsuccessView({
    _i19.Key? key,
    int xpEarned = 30,
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  }) async {
    return navigateTo<dynamic>(Routes.postsuccessView,
        arguments: PostsuccessViewArguments(key: key, xpEarned: xpEarned),
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToWalletView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.walletView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToUploadavatarView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.uploadavatarView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> navigateToSendView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return navigateTo<dynamic>(Routes.sendView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithHomeView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.homeView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithStartupView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.startupView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithSignupView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.signupView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithSigninView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.signinView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithBottomnavView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.bottomnavView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithQuestsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.questsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithChatsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.chatsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithRoomsView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.roomsView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithProfileView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.profileView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithChatroomView({
    _i20.ChatUser? chatUser,
    _i19.Key? key,
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  }) async {
    return replaceWith<dynamic>(Routes.chatroomView,
        arguments: ChatroomViewArguments(chatUser: chatUser, key: key),
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithCreateroomView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.createroomView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithCreatepostView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.createpostView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithMyPageView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.myPageView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithPostsuccessView({
    _i19.Key? key,
    int xpEarned = 30,
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  }) async {
    return replaceWith<dynamic>(Routes.postsuccessView,
        arguments: PostsuccessViewArguments(key: key, xpEarned: xpEarned),
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithWalletView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.walletView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithUploadavatarView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.uploadavatarView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }

  Future<dynamic> replaceWithSendView([
    int? routerId,
    bool preventDuplicates = true,
    Map<String, String>? parameters,
    Widget Function(BuildContext, Animation<double>, Animation<double>, Widget)?
        transition,
  ]) async {
    return replaceWith<dynamic>(Routes.sendView,
        id: routerId,
        preventDuplicates: preventDuplicates,
        parameters: parameters,
        transition: transition);
  }
}
