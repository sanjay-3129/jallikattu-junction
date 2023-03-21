import {
  ActivityIndicator,
  Image,
  LogBox,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Logo from '../../assets/svg/logo.svg';

const MobileNumber = ({navigation, route}) => {
  const {params = {}} = route;
  const {logout} = params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const onAuthStateChanged = async user => {
    if (!logout) {
      if (phoneNumber) {
        console.log('MobileNumber', phoneNumber);
        const doc = await firestore()
          .collection('users')
          .doc(`+91${phoneNumber}`)
          .get();

        if (!doc.data()) {
          navigation.navigate('city-select');
          return;
        }
        navigation.navigate('main', {phoneNumber});
      } else {
        if (user) {
          const doc = await firestore()
            .collection('users')
            .doc(user.phoneNumber)
            .get();

          if (!doc.data()) {
            navigation.navigate('city-select');
            return;
          }
          if (!doc.data().city || !doc.data().area) {
            navigation.navigate('city-select');
            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  const checkIfExistingUser = async () => {
    setLoading(true);
    const doc = await firestore()
      .collection('users')
      .doc(`+91${phoneNumber}`)
      .get();
    console.log('checkExistingUser-registered', doc.data());
    if (doc.data() !== undefined) {
      // user registered
      if (phoneNumber.length === 10) {
        auth()
          .signInWithPhoneNumber(`+91${phoneNumber}`)
          .then(confirmation => {
            setLoading(false);
            navigation.navigate('otp', {
              confirmation: confirmation,
              isRegistered: true,
              phone: phoneNumber,
            });
          })
          .catch(e => {
            ToastAndroid.show(`${e.code} - ${e.message}`, ToastAndroid.LONG);
            setLoading(false);
          });
      } else {
        setLoading(false);
        ToastAndroid.show(
          'Please Enter Valid 10 Digit Indian Phone Number',
          ToastAndroid.SHORT,
        );
      }
    } else {
      // user not registered
      // console.log('checkExistingUser-new user', doc.data());
      // navigation.navigate('main', {phoneNumber});
      if (phoneNumber.length === 10) {
        const confirmation = await auth().signInWithPhoneNumber(
          `+91${phoneNumber}`,
        );
        setLoading(false);
        navigation.navigate('otp', {
          confirmation: confirmation,
          isRegistered: false,
        });
      } else {
        setLoading(false);
        ToastAndroid.show(
          'Please Enter Valid 10 Digit Indian Phone Number',
          ToastAndroid.SHORT,
        );
      }
    }
  };

  const onSubmit = async () => {
    if (phoneNumber.length === 10) {
      checkIfExistingUser(phoneNumber);
    } else {
      ToastAndroid.show(
        'Please Enter Valid 10 Digit Indian Phone Number',
        ToastAndroid.LONG,
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle={'light-content'} />
      <Image
        resizeMode="cover"
        style={{width: '100%'}}
        source={require('../../assets/mobilescreenbg.jpeg')}
      />
      <View style={styles.mainView}>
        <View>
          <Logo />
        </View>
        <View style={styles.mobileInputContainer}>
          <Text style={styles.mobileInputTitle}>Mobile Number</Text>
          <TextInput
            keyboardType={'number-pad'}
            maxLength={10}
            style={styles.mobileInput}
            returnKeyType="next"
            value={phoneNumber}
            onChangeText={v => setPhoneNumber(v)}
            onSubmitEditing={onSubmit}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={() => onSubmit()}
            style={styles.nextButton}>
            {loading ? (
              <ActivityIndicator size={'small'} color="white" />
            ) : (
              <Text style={styles.nextButtonText}>NEXT</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MobileNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  mainView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mobileInputContainer: {
    bottom: '0%',
    width: '100%',
    height: '30%',
    paddingTop: 30,
    paddingHorizontal: 30,
    position: 'absolute',
    backgroundColor: 'white',
  },
  mobileInputTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: 'black',
    fontFamily: 'Montserrat-Bold',
  },
  mobileInput: {
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
    color: 'black',
    fontSize: 18,
    lineHeight: 22,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
  },
  nextButton: {
    backgroundColor: '#6f0b83',
    marginTop: 10,
    borderRadius: 7,
    padding: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
});
