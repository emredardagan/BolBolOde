# Fastlane configuration for BölBölÖde
# Note: This is an example. For Expo projects, EAS Build/Submit is recommended.

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number(
      xcodeproj: "ios/BolBolOde.xcodeproj"
    )
    
    build_app(
      workspace: "ios/BolBolOde.xcworkspace",
      scheme: "BolBolOde",
      export_method: "app-store"
    )
    
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      skip_submission: true
    )
  end

  desc "Build and upload to App Store"
  lane :release do
    increment_build_number(
      xcodeproj: "ios/BolBolOde.xcodeproj"
    )
    
    build_app(
      workspace: "ios/BolBolOde.xcworkspace",
      scheme: "BolBolOde",
      export_method: "app-store"
    )
    
    upload_to_app_store(
      skip_metadata: false,
      skip_screenshots: false,
      force: true
    )
  end
end

platform :android do
  desc "Build and upload to Internal Testing"
  lane :beta do
    gradle(
      task: "bundle",
      build_type: "Release",
      properties: {
        "android.injected.signing.store.file" => ENV["ANDROID_KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["ANDROID_KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["ANDROID_KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["ANDROID_KEY_PASSWORD"]
      }
    )
    
    upload_to_play_store(
      track: "internal",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc "Build and upload to Production"
  lane :release do
    gradle(
      task: "bundle",
      build_type: "Release",
      properties: {
        "android.injected.signing.store.file" => ENV["ANDROID_KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["ANDROID_KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["ANDROID_KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["ANDROID_KEY_PASSWORD"]
      }
    )
    
    upload_to_play_store(
      track: "production",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      skip_upload_metadata: false,
      skip_upload_images: false,
      skip_upload_screenshots: false
    )
  end
end

