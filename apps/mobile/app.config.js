import 'dotenv/config';

export default {
  expo: {
    name: 'HeartBond',
    slug: 'RelationshipCareApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'relationship-care',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.relationshipcare.app',
      userInterfaceStyle: 'automatic',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.relationshipcare.app',
      userInterfaceStyle: 'automatic',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-localization',
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your partner.',
          cameraPermission:
            'The app needs access to your camera to take profile pictures.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
