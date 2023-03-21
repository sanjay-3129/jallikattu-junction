import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MobileNumber from './src/screens/auth/MobileNumber';
import OTP from './src/screens/auth/OTP';
import Signup from './src/screens/auth/Signup';
import AreaSelection from './src/screens/onboarding/AreaSelection';
import CitySelection from './src/screens/onboarding/CitySelection';
import Product from './src/screens/product/Product';
import BottomNavigation from './src/navigation/BottomNavigation';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/redux/store';
import MyAccount from './src/screens/account/MyAccount';
import MyProfile from './src/screens/account/MyProfileEdit';
import MySubscriptions from './src/screens/account/MySubscriptions';
import MyOrders from './src/screens/account/MyOrders';
import MyVacations from './src/screens/account/MyVacations';
import MyWallet from './src/screens/account/MyWallet';
import Help from './src/screens/onboarding/Help';
import Checkout from './src/screens/checkout/Checkout';
import Privacy from './src/screens/others/Privacy';
import Terms from './src/screens/others/Terms';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  // const navigation = useNavigation();
  const [notificationData, setNotificationData] = useState(undefined);

  const onAuthStateChanged = async user => {
    const jsonValue = await AsyncStorage.getItem('user');
    const savedUser = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log(savedUser);
    if (savedUser) {
      console.log('saveduser', savedUser);
      messaging()
        .getToken(firebase.app().options.messagingSenderId)
        .then(x => {
          if (savedUser.fcm_token === undefined) {
            // store token to db
            firestore()
              .collection('users')
              .doc(savedUser.mobile)
              .update({fcm_token: [x]});
          } else {
            // same user but logging in from other phone
            if (savedUser.fcm_token[savedUser.fcm_token.length - 1] !== x) {
              let fcm_tokens = [...savedUser.fcm_token, x];
              firestore()
                .collection('users')
                .doc(savedUser.mobile)
                .update({fcm_token: fcm_tokens});
            }
          }
        })
        .catch(e => console.log('getToken()', e));
      setUser(savedUser);
      return;
    }
    setUser('-1');
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );
    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates.checkNeedsUpdate().then(result => {
      // console.log('apppupdate', result.shouldUpdate);
      if (result.shouldUpdate) {
        let updateOptions = {};
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }
        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    });
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
        remoteMessage.data,
      );
      setNotificationData(remoteMessage.data);
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
            remoteMessage.data,
          );
          setNotificationData(remoteMessage.data);
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          // navigation.navigate(remoteMessage.data.type);
        }
        // setLoading(false);
      })
      .catch(e => console.log('initial noification: ', e));

    messaging()
      .subscribeToTopic('general')
      .then(() => console.log('Subscribed to topic!'));
  }, []);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        {user !== -1 && (user?.phoneNumber || user?.mobile) ? (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
              name={'main'}
              component={BottomNavigation}
              initialParams={{
                phoneNumber: user.mobile ?? user.phoneNumber,
                notificationData: notificationData,
              }}
            />
            <Stack.Screen name={'mobile-number'} component={MobileNumber} />
            <Stack.Screen name={'product'} component={Product} />
            {/* <Stack.Screen name="wallet" component={MyWallet} /> */}
            <Stack.Screen name="vacations" component={MyVacations} />
            <Stack.Screen name="orders" component={MyOrders} />
            <Stack.Screen name="subscriptions" component={MySubscriptions} />
            <Stack.Screen name="profile" component={MyProfile} />
            <Stack.Screen name="account" component={MyAccount} />
            <Stack.Screen name="help" component={Help} />
            <Stack.Screen name={'otp'} component={OTP} />
            <Stack.Screen name={'area-select'} component={AreaSelection} />
            <Stack.Screen name={'city-select'} component={CitySelection} />
            <Stack.Screen name={'signup'} component={Signup} />
            <Stack.Screen name={'checkout'} component={Checkout} />
            <Stack.Screen name={'pp'} component={Privacy} />
            <Stack.Screen name={'tc'} component={Terms} />
          </Stack.Navigator>
        ) : (
          user === '-1' && (
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name={'mobile-number'} component={MobileNumber} />
              <Stack.Screen name={'otp'} component={OTP} />
              <Stack.Screen name={'main'} component={BottomNavigation} />
              <Stack.Screen name={'area-select'} component={AreaSelection} />
              <Stack.Screen name={'city-select'} component={CitySelection} />
              <Stack.Screen name={'signup'} component={Signup} />
              <Stack.Screen name={'product'} component={Product} />
              {/* <Stack.Screen name="wallet" component={MyWallet} /> */}
              <Stack.Screen name="vacations" component={MyVacations} />
              <Stack.Screen name="orders" component={MyOrders} />
              <Stack.Screen name="subscriptions" component={MySubscriptions} />
              <Stack.Screen name="profile" component={MyProfile} />
              <Stack.Screen name="account" component={MyAccount} />
              <Stack.Screen name={'checkout'} component={Checkout} />
            </Stack.Navigator>
          )
        )}
      </NavigationContainer>
    </ReduxProvider>
  );
};

export default App;
