import AVKit
import ExpoModulesCore

public class AirplayButtonModule: Module {
    public func definition() -> ModuleDefinition {
        Name("AirplayButton")

        View(AirplayButtonView.self) {
            Prop("tintColor") { (view: AirplayButtonView, color: UIColor) in
                view.routePickerView.tintColor = color
            }
            Prop("activeTintColor") { (view: AirplayButtonView, color: UIColor) in
                view.routePickerView.activeTintColor = color
            }
        }
    }
}
