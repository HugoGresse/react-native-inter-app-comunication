# Inter app communication with React Native

This project demosntrate how to communicate between two application on the same device (Android or iOS) using custom URL scheme (also known as deep link). 

**Features** 
- two ways communication between "client" and "offline" apps
- Android AND iOS supported
- scheme name: 
    - plantnet://identification-results/XXXXXX
    - pnoffline://identification/XXXXXX
- image saved on external storage on android to be able to be read by other apps
- transmit data within the chustom url scheme with a stringified & base64 JSON appended at the end

### Setup

1. Clone
2. `npm install` (in `client/` and `offline/`)
3. (iOS) `pod install` in `client/ios` and `offline/ios`
4. client: `npm run start` 
5. client: `npm run android` (or `ios`)
6. offline: `npm run start`  (packager is started on port 8082 because the default port is already in use)
7. offline: `npm run android` (or `ios`)
8. change **offline** server & port to use port 8082
