import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import Hamburger from '../../assets/svg/hamburger.svg';
import HeaderLogo from '../../assets/svg/headerlogo.svg';
import Wallet from '../../assets/svg/wallet.svg';
import {useNavigation} from '@react-navigation/native';

const HomeHeader = ({openDrawer}) => {
  const {user} = useSelector(state => state.reducer);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const navigation = useNavigation();

  const getWalletBalance = async () => {
    const doc = await firestore().collection('users').doc(user.mobile).get();
    let value = doc.data();
    // let freeWallet = value?.freeWallet ? value?.freeWallet : 0;
    let wallet = value?.wallet ? value?.wallet : 0;
    setWalletBalance(wallet);
  };

  useEffect(() => {
    getWalletBalance();
  }, [user]);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer}>
        <Hamburger />
      </TouchableOpacity>
      <View style={{marginRight: 90}}>
        <HeaderLogo />
      </View>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('wallet')}
        activeOpacity={0.7}
        style={styles.walletButton}>
        <Wallet />
        <Text style={styles.walletAmount}>₹{walletBalance}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  walletButton: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  walletAmount: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    marginLeft: 5,
  },
});
