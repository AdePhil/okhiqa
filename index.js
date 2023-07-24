/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import * as OkHi from 'react-native-okhi';
import {branchId, clientKey} from '@env';

const messaging = Platform.select({
  ios: () => null,
  android: () => require('@react-native-firebase/messaging').default,
})();

messaging?.()?.setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage?.data?.origin === 'okhi') {
    await OkHi.onMessageReceived();
  }
  console.log('Message handled in the background!', remoteMessage);
});

OkHi.initialize({
  credentials: {
    branchId,
    clientKey,
  },
  context: {
    mode: 'sandbox',
  },
  notification: {
    title: 'Address verification in progress',
    text: 'Tap here to view your verification status.',
    channelId: 'okhi',
    channelName: 'OkHi Channel',
    channelDescription: 'OkHi verification alerts',
  },
})
  .then(() => console.log('init done'))
  .catch((e: any) => console.log('Index.js ', e));

AppRegistry.registerComponent(appName, () => App);
