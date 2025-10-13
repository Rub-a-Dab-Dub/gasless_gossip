import 'package:stacked/stacked.dart';

class BottomnavViewModel extends IndexTrackingViewModel {
  @override
  void setIndex(int value) {
    super.setIndex(value);
    rebuildUi();
  }
}
