require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'airplay-button'
  s.version        = package['version']
  s.summary        = 'Native AVRoutePickerView wrapper'
  s.homepage       = 'https://github.com/placeholder'
  s.license        = 'MIT'
  s.author         = 'lamusic'
  s.platform       = :ios, '15.1'
  s.source         = { :path => '.' }
  s.source_files   = 'ios/**/*.swift'
  s.dependency 'ExpoModulesCore'
end
