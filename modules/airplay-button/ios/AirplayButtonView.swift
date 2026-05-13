import AVKit
import ExpoModulesCore

class AirplayButtonView: ExpoView {
    let routePickerView = AVRoutePickerView()

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        clipsToBounds = true
        routePickerView.backgroundColor = .clear
        addSubview(routePickerView)
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        routePickerView.frame = bounds
    }
}
