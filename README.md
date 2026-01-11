# Spot-It: Citizen Mobile App

Spot-It is a mobile application designed to empower citizens to report and track issues in their community. Built with React Native and Expo, it leverages device features like the camera and geolocation to provide accurate and actionable reports.

## 🚀 Features

*   **Issue Reporting (Inferred):** Capture and report issues using the device camera.
*   **Geolocation:** Automatically tag reports with precise location data.
*   **Interactive Maps:** View reported issues on a map interface.
*   **User-Friendly Navigation:** Smooth navigation using bottom tabs and stack navigators.
*   **Cross-Platform:** Runs seamlessly on both Android and iOS.

## 🛠 Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/)
*   **Platform:** [Expo](https://expo.dev/)
*   **Navigation:** [React Navigation](https://reactnavigation.org/) (Native Stack & Bottom Tabs)
*   **Maps:** [React Native Maps](https://github.com/react-native-maps/react-native-maps)
*   **Networking:** [Axios](https://axios-http.com/)
*   **Device Features:** Expo Camera, Expo Location, Expo Image Picker

## 📂 Project Structure

```
spotit-mobile-app/
├── assets/         # Images and fonts
├── components/     # Reusable UI components
├── constants/      # App constants and configuration
├── navigation/     # Navigation setup (Stack, Tabs)
├── screens/        # Screen components (Pages)
├── styles/         # Global styles
├── utils/          # Helper functions and utilities
└── App.js          # Entry point
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS recommended)
*   [Expo Go](https://expo.dev/client) app installed on your physical device (or an Android/iOS emulator).

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory:
    ```bash
    cd spotit-mobile-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

Start the development server:

```bash
npx expo start
```

*   **Android:** Press `a` in the terminal or scan the QR code with the Expo Go app.
*   **iOS:** Press `i` in the terminal or scan the QR code with the Camera app (requires Expo Go).

## 📄 Scripts

*   `npm start`: Start the Expo development server.
*   `npm run android`: Start on Android emulator/device.
*   `npm run ios`: Start on iOS emulator/device.
*   `npm run web`: Start on the web.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
