export const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    firebase: {
      apiKey: 'YOUR_DEV_API_KEY',
      authDomain: 'your-dev-app.firebaseapp.com',
      projectId: 'your-dev-project',
      storageBucket: 'your-dev-app.appspot.com',
      messagingSenderId: 'YOUR_DEV_SENDER_ID',
      appId: 'YOUR_DEV_APP_ID',
    },
  },
  staging: {
    apiUrl: 'https://staging-api.relationshipcare.com/api',
    firebase: {
      apiKey: 'YOUR_STAGING_API_KEY',
      authDomain: 'your-staging-app.firebaseapp.com',
      projectId: 'your-staging-project',
      storageBucket: 'your-staging-app.appspot.com',
      messagingSenderId: 'YOUR_STAGING_SENDER_ID',
      appId: 'YOUR_STAGING_APP_ID',
    },
  },
  production: {
    apiUrl: 'https://api.relationshipcare.com/api',
    firebase: {
      apiKey: 'YOUR_PROD_API_KEY',
      authDomain: 'your-prod-app.firebaseapp.com',
      projectId: 'your-prod-project',
      storageBucket: 'your-prod-app.appspot.com',
      messagingSenderId: 'YOUR_PROD_SENDER_ID',
      appId: 'YOUR_PROD_APP_ID',
    },
  },
};

import Constants from 'expo-constants';

const getEnv = (): 'development' | 'staging' | 'production' => {
  const extra = Constants.expoConfig?.extra;
  if (extra?.env) {
    return extra.env as 'development' | 'staging' | 'production';
  }
  return __DEV__ ? 'development' : 'production';
};

export const currentConfig = config[getEnv()];
