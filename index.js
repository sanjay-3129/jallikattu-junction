/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import messaging from '@react-native-firebase/messaging';

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
// AppRegistry.registerComponent(appName, () => App);

// AIzaSyACFe2dyb9WOAvp5TTAqnFZpGLVd7wxbq0 - google maps api
