import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import Logo from '../../assets/svg/logo.svg';
import OTPInput from '../../components/OTPInput/OTPInput';
import {useEffect} from 'react';

const OTP = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const {params = {}} = route;
  const {confirmation, isRegistered, phoneNumber} = params;

  const onAuthStateChanged = user => {
    if (user) {
      // console.log('OTP: onAuthStateChanged-registered', isRegistered);
      if (!isRegistered) {
        // new user
        navigation.navigate('city-select');
      }
    }
  };

  useEffect(() => {
    // console.log('params', params);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onSubmit = async code => {
    await confirmation.confirm(code);
    if (isRegistered) {
      // already registered
      console.log('already registered', isRegistered);
      navigation.navigate('main', {phoneNumber});
    } else {
      // navigation.navigate('signup');
      navigation.navigate('city-select');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <View style={{flex: 1.7}}>
        <Logo />
      </View>
      <View style={styles.otpInputContainer}>
        <Text style={styles.otpInputText}>Enter OTP</Text>
        <View>
          <OTPInput
            otp={otp}
            setOtp={setOtp}
            onSubmit={onSubmit}
            confirmation={confirmation}
          />
        </View>
      </View>
    </View>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
    paddingTop: 50,
  },
  otpInputContainer: {
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 50,
  },
  otpInputText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
  },
});
