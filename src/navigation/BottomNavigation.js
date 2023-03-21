import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import {HelpIcon, HomeIcon, OrdersIcon, WalletIcon} from './assets';
import DrawerModal from '../components/Modal/DrawerModal';
import MyOrders from '../screens/account/MyOrders';
import MyWallet from '../screens/account/MyWallet';
import Help from '../screens/onboarding/Help';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({route}) => {
  const [selectedTab, setSelectedTab] = useState();
  const {params = {}} = route;
  const {phoneNumber, notificationData} = params;
  const navigation = useNavigation();

  useEffect(() => {
    setSelectedTab(0);
    console.log('BottomNavigation', phoneNumber, notificationData);
  }, []);
  // }, [notificationData, phoneNumber, navigation]);

  useEffect(() => {
    if (notificationData !== undefined) {
      if (notificationData.type === 'orders') {
        setSelectedTab(1);
        navigation.navigate('orders', {
          date: notificationData.date,
        });
      }
    }
  }, [navigation, notificationData]);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {borderTopLeftRadius: 20, borderTopRightRadius: 20},
        }}>
        <Tab.Screen
          options={({navigation}) => ({
            tabBarButton: props => {
              return (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    setSelectedTab(0);
                    navigation.navigate('Home', {phoneNumber});
                  }}
                  style={[
                    styles.tabBarButton,
                    {
                      marginHorizontal: 20,
                    },
                  ]}>
                  <HomeIcon active={selectedTab === 0} />
                </TouchableOpacity>
              );
            },
          })}
          name="Home"
          initialParams={{phoneNumber}}
          component={Home}
        />
        <Tab.Screen
          options={({navigation}) => ({
            tabBarButton: props => {
              return (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    setSelectedTab(1);
                    navigation.navigate('orders');
                  }}
                  style={[
                    styles.tabBarButton,
                    {
                      marginHorizontal: 20,
                    },
                  ]}>
                  <OrdersIcon active={selectedTab === 1} />
                </TouchableOpacity>
              );
            },
          })}
          name="orders"
          component={MyOrders}
        />
        {/* <Tab.Screen
          options={({navigation}) => ({
            tabBarButton: props => {
              return (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    setSelectedTab(2);
                    navigation.navigate('wallet');
                  }}
                  style={[
                    styles.tabBarButton,
                    {
                      marginHorizontal: 20,
                    },
                  ]}>
                  <WalletIcon active={selectedTab === 2} />
                </TouchableOpacity>
              );
            },
          })}
          name="wallet"
          component={MyWallet}
        /> */}
        <Tab.Screen
          options={({navigation}) => ({
            tabBarButton: props => {
              return (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    setSelectedTab(3);
                    navigation.navigate('help');
                  }}
                  style={[
                    styles.tabBarButton,
                    {
                      marginHorizontal: 20,
                    },
                  ]}>
                  <HelpIcon active={selectedTab === 3} />
                </TouchableOpacity>
              );
            },
          })}
          name="help"
          component={Help}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
});
