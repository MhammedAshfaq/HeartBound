import 'dotenv/config';
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withModularHeaders = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
      
      if (!podfileContent.includes('use_modular_headers!')) {
        podfileContent = podfileContent.replace(
          /target 'HeartBond' do/g,
          "target 'HeartBond' do\n  use_modular_headers!"
        );
        fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
        console.log('[CONFIG PLUGIN] Added use_modular_headers! to Podfile');
      }
      return config;
    },
  ]);
};

const appConfig = {
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
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: 'com.googleusercontent.apps.781537998621-hnc8gveiva2fs4r6rcl0nak2dln6lj38'
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "88277855-eec4-4ab3-8b9e-ac32e2c67999"
      }
    }
  },
};

export default withModularHeaders(appConfig);
