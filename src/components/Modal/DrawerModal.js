import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Share from 'react-native-share';
import AccountIcon from '../../assets/svg/drawer/draweraccount.svg';
import SubscriptionIcon from '../../assets/svg/drawer/drawersubs.svg';
import VacationIcon from '../../assets/svg/drawer/drawervacs.svg';
import HelpIcon from '../../assets/svg/drawer/drawerhelpsvg.svg';
import LogoutIcon from '../../assets/svg/drawer/drawerlogout.svg';
import ShareIcon from '../../assets/svg/drawer/drawershare.svg';
import {useDispatch, useSelector} from 'react-redux';
import {setDrawerVisibility, setUser} from '../../redux/actions';
import {useNavigation} from '@react-navigation/native';

const DrawerModal = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {drawerVisibility, user} = useSelector(state => state.reducer);
  const {firstName = '', lastName = '', address = {}, mobile = ''} = user;

  const ModalOptions = ({visible}) => ({
    isVisible: visible,
    coverScreen: true,
    animationIn: 'fadeInLeft',
    animationOut: 'fadeOutLeft',
    style: {margin: 0, width: '70%'},
    onBackButtonPress: () => {
      dispatch(setDrawerVisibility(false));
    },
    onBackdropPress: () => {
      dispatch(setDrawerVisibility(false));
    },
  });

  const logoutTheUser = async () => {
    dispatch(setDrawerVisibility(false));
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

  const share = async () => {
    const options = {
      message:
        'Hey! Use Jallikattu Junction App! Download this awesome app with this link www.jallikattujn.com',
    };
    await Share.open(options);
  };

  return (
    <View>
      <Modal {...ModalOptions({visible: drawerVisibility})}>
        <View style={styles.modal}>
          <View style={styles.drawerHeader}>
            <Text
              onPress={() => navigation.navigate('account')}
              style={styles.name}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.mobile}>{mobile}</Text>
            <Text style={styles.address}>
              {`${address.door},${address.street},${address.area}`}
            </Text>
          </View>
          <View style={styles.drawerBody}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('account');
                dispatch(setDrawerVisibility(false));
              }}
              style={styles.drawerBodyButton}>
              <AccountIcon />
              <Text style={styles.drawerBodyButtonText}>My Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(setDrawerVisibility(false));
                navigation.navigate('subscriptions');
              }}
              style={styles.drawerBodyButton}>
              <SubscriptionIcon />
              <Text style={styles.drawerBodyButtonText}>My Subscriptions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('vacations');
                dispatch(setDrawerVisibility(false));
              }}
              style={styles.drawerBodyButton}>
              <VacationIcon />
              <Text style={styles.drawerBodyButtonText}>My Vacations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('help')}
              style={styles.drawerBodyButton}>
              <HelpIcon />
              <Text style={styles.drawerBodyButtonText}>Need Help?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('pp')}
              style={styles.drawerBodyButton}>
              <HelpIcon />
              <Text style={styles.drawerBodyButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('tc')}
              style={styles.drawerBodyButton}>
              <HelpIcon />
              <Text style={styles.drawerBodyButtonText}>
                Terms and Conditions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={share} style={styles.drawerBodyButton}>
              <ShareIcon />
              <Text style={styles.drawerBodyButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logoutTheUser}
              style={styles.drawerBodyButton}>
              <LogoutIcon />
              <Text style={styles.drawerBodyButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DrawerModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  drawerHeader: {
    flex: 1,
    backgroundColor: '#6f0b83',
    justifyContent: 'center',
    padding: 25,
  },
  drawerBody: {
    flex: 2,
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
  },
  mobile: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Montserrat-Medium',
    color: 'white',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  address: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Montserrat-Medium',
    color: 'white',
    marginHorizontal: 10,
  },
  drawerBodyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  drawerBodyButtonText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#898989',
    marginLeft: 10,
  },
});
