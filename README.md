# capacitor-http-request-no-result-issue

This repo is a reproduction sample app for what appears to be an issue in [Capacitor](https://github.com/ionic-team/capacitor).

The sample app uses the following libraries at these approximate versions
- Capacitor - `4.5.0`
- Angular - `15.0.0`
- Ionic Angular - `6.3.8`

The app uses the Ionic Angular "blank" starter app.

## Setup
- Set up your dev environment for Capacitor development by following the official docs [here](https://capacitorjs.com/docs/getting-started/environment-setup).
- From the terminal in the root of the repo, run the following commands
  - `npm install`
  - `npm run cap.build`

## Running the App

You can use either Capacitor's Live Reload feature or manually build the app (front-end and native) and deploy the native app again. Changes to the native layer will require a subsequent native app build and deployment.

### Live Reload
- Reference: https://capacitorjs.com/docs/guides/live-reload
- Works like an `ionic serve` in which the WebView is reloaded after updating TypeScript, HTML, CSS, etc. It prompts for the device/emulator you'd like to deploy to, runs a `cap sync`, starts an `ionic serve`, builds the native app, and deploys the native app to the device/emulator.

- Run the command
  - `cap.run.ios` or `cap.run.android`
    - This command is comprised of
      - `npx ionic cap run <platform> --livereload --external`
        - Using the `--external` option
          - Uses a server URL for the WebView that is _not_ `localhost` but rather loads `ionic serve` content remotely from your desktop computer using the computer's IP address.
          - Allows JavaScript source mapping to work when debugging the Android WebView.
          - Required for device use but not necessarily for emulators which can successfully load content from the desktop computer using `localhost`. However, without providing this option you will not get JavaScript source mapping when debugging the Android WebView on an emulator.
          - Allows for livereloads to occur without a USB connection.
          - Some privileged Web APIs (for example, Geolocation) that only work when using SSL or `localhost` may not work with the app hosted at an IP address. Self-signed certificates [do not appear](https://github.com/ionic-team/capacitor/issues/3707#issuecomment-712997461) to be an option.
- Your computer and device _must_ be on the same WiFi network. VPNs could potentially cause problems.
  - There may be multiple network interfaces detected so at the prompt choose the one which is your local IP address. See [here](https://capacitorjs.com/docs/guides/live-reload#using-with-framework-clis) for help finding your IP.
- Devices may need to be connected via USB for the native build deployment but can thereafter get livereload updates of the front-end build without needing a wired connection.
  - The device will continue to get livereload updates even after restarting the dev server when using a previous native deployment so long as you continue serving on the same IP. This means that you can have an Android and iOS device both running the same build and get the same updates although they must have been built in succession with a closing of the command before moving onto the other.
- When the deployment is finished, `capacitor.config.json`, `AndroidManifest.xml`, and `AndroidManifest.xml.orig` may appear as pending changes in source control. They contain temporary configuration changes necessary to facilitate livereload. They should be automatically removed from pending changes upon `Ctrl + C` of the process but manual removal may occasionally be necessary if the clean-up step fails.

### Manual Build and Deploy
- To build the front-end and copy the files to the native app, run
  - `npm run cap.build`
- Open the native IDE (if it's not already open) with
  - `npx cap open ios` or `npx cap open android`
- Use the native IDE to build and deploy the native app.

## Debugging the App

### iOS

To debug the WebView, follow the instructions [here](https://ionicframework.com/docs/developing/ios#using-safari-web-inspector) to use the Safari Web Inspector. To debug the native app, run it in Xcode and [view the native logs](https://ionicframework.com/docs/developing/ios#viewing-native-logs).

### Android

To debug the WebView, follow the instructions [here](https://ionicframework.com/docs/developing/android#using-chrome-devtools) to use the Chrome Dev Tools inspector. To debug the native app, run it in Android Studio and [view the native logs](https://ionicframework.com/docs/developing/android#viewing-native-logs).

## Steps to Reproduce

- Get the app running by following [Running the App](#running-the-app) for iOS.
- Once the app is running, open the Safari Web Inspector by following instructions in [Debugging the App](#debugging-the-app). Open the Console view.
- There is one button in the app's UI: `Make Request`.
  - Their click events will be handled in `/src/app/home/home.page.ts`.
  - This will make a network request to a URL used in our production app using the Angular `HttpClient` which will use the `CapacitorHttp` plugin at a lower-level.
  - The URL is known to return an error response. The issue pertains to how `CapacitorHttp` handles that response.
- Click the button that says `Make Request`.
  - In the console, you may see the `CapacitorHttp` request and result objects.
    - iOS with `CapacitorHttp`
      - The request never completes. You'll see a `CapacitorHttp` request logged to the console, but no result is logged. This is unexpected; expected the request to complete with an error.
  - Other configurations behave more as expected. Here's how they compare:
    - iOS without `CapacitorHttp`:
      - The request will fail immediately/complete.
      - There will be an unhandled error in the console:
        - `ERROR ??? Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error","url":"https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json","ok":false,"name":"HttpErrorResponse","message":"Http failure response for https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json: 0 Unknown Error","error":{"isTrusted":true}}`
      - There will be an error that follows in the console:
        - `Failed to load resource: A server with the specified hostname could not be found. https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json`
    - Android with `CapacitorHttp`:
      - The request will fail immediately/complete.
      - There will be a `CapacitorHttp` error in the console:
        - ```json
          {
            message: 'UnknownHostException'
          }
          ```
      - There will be an unhandled error that follows in the console:
        - `ERROR Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error","url":"https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json","ok":false,"name":"HttpErrorResponse","message":"Http failure response for https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json: 0 Unknown Error","error":{"isTrusted":false}}`
    - Android without `CapacitorHttp`:
      - The request will fail immediately/complete.
      - There will be an unhandled error in the console:
        - `ERROR Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error","url":"https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json","ok":false,"name":"HttpErrorResponse","message":"Http failure response for https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json: 0 Unknown Error","error":{"isTrusted":true}}`
      - There will be an error that follows in the console:
        - `GET https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json net::ERR_NAME_NOT_RESOLVED`
