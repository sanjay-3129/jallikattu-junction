import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import BackButton from '../../assets/svg/backbutton.svg';
import Pencil from '../../assets/svg/pencil.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import CallIcon from '../../assets/svg/call.svg';
import MailIcon from '../../assets/svg/mail.svg';
import LocationIcon from '../../assets/svg/location.svg';
import SubscriptionIcon from '../../assets/svg/drawer/drawersubs.svg';
import VacationIcon from '../../assets/svg/drawer/drawervacs.svg';
import LogoutIcon from '../../assets/svg/drawer/drawerlogout.svg';
import OrdersIcon from '../../assets/svg/drawer/drawerOrders.svg';
import WalletIcon from '../../assets/svg/drawer/drawerWallet.svg';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/actions';

const MyAccount = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.reducer);
  const {
    firstName = '',
    lastName = '',
    address = {},
    mobile = '',
    email,
  } = user;

  const logoutTheUser = async () => {
    try {
      await auth().signOut();
      navigation.navigate('mobile-number', {logout: true});
      await AsyncStorage.removeItem('user');
      dispatch(setUser({}));
    } catch (e) {
      navigation.navigate('mobile-number', {logout: true});
      await AsyncStorage.removeItem('user');
      dispatch(setUser({}));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <View />
      </View>
      <View style={styles.body}>
        <View style={styles.customerCard}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {firstName} {lastName}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('profile')}>
              <Pencil />
            </TouchableOpacity>
          </View>
          <View style={styles.customInfoContainer}>
            <View style={styles.customerInfo}>
              <CallIcon />
              <Text style={styles.customerMobile}>{mobile}</Text>
            </View>
            <View style={styles.customerInfo}>
              <MailIcon />
              <Text style={styles.customerMail}>{email}</Text>
            </View>
            <View style={styles.customerInfo}>
              <LocationIcon />
              <Text style={styles.customerLocation}>
                {`${address.door},${address.street},${address.area}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.profileAccountOptions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('subscriptions')}
            style={styles.profileOptionButton}>
            <SubscriptionIcon />
            <Text style={styles.profileOptionButtonText}>My Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('orders')}
            style={styles.profileOptionButton}>
            <OrdersIcon />
            <Text style={styles.profileOptionButtonText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('wallet')}
            style={styles.profileOptionButton}>
            <WalletIcon />
            <Text style={styles.profileOptionButtonText}>My Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('vacations')}
            style={styles.profileOptionButton}>
            <VacationIcon />
            <Text style={styles.profileOptionButtonText}>My Vacations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logoutTheUser}
            style={styles.profileOptionButton}>
            <LogoutIcon />
            <Text style={styles.profileOptionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textTransform: 'uppercase',
  },
  body: {
    backgroundColor: 'white',
    flex: 1,
    borderTopEndRadius: 35,
    borderTopLeftRadius: 35,
    paddingHorizontal: 15,
    paddingTop: 40,
    marginTop: 20,
  },
  customerCard: {
    borderRadius: 6,
    elevation: 2,
    backgroundColor: 'white',
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#6f0b83',
  },
  customInfoContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  customerMobile: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    marginLeft: 5,
  },
  customerMail: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    marginLeft: 5,
  },
  customerLocation: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    marginLeft: 5,
  },
  profileAccountOptions: {
    marginVertical: 30,
    borderRadius: 6,
    backgroundColor: 'white',
    elevation: 2,
  },
  profileOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
  },
  profileOptionButtonText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#898989',
    marginLeft: 10,
  },
});
