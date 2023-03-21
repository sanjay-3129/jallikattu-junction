import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  View,
  Alert,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import HeaderLogo from '../../assets/svg/headerlogo.svg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import marker from '../../assets/icons8-marker.png';

const SignupButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.signupButton}>
      <Text style={styles.signupText}>SIGN-UP</Text>
    </TouchableOpacity>
  );
};

const Signup = ({navigation}) => {
  const [activeUser, setActiveUser] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: {door: '', street: '', area: ''},
  });
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const refMap = useRef(null);
  // const [markerRegion, setMarkerRegion] = useState({
  //   latitude: 13.0827,
  //   longitude: 80.2707,
  // });

  const onAuthStateChanged = user => {
    if (user) {
      setActiveUser(user);
      // check user, whether the lat and long is already there and set if its there
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(granted => {
          if (granted) {
            console.log('You can use the ACCESS_FINE_LOCATION');
            if (user?.location) {
              // setMarkerRegion(user.location);
              setRegion({
                ...user.location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            } else {
              // console.log('geoload');
              Geolocation.getCurrentPosition(
                pos => {
                  const crd = pos.coords;
                  console.log('geolo', crd);
                  // setMarkerRegion({
                  //   latitude: crd.latitude,
                  //   longitude: crd.longitude,
                  // });
                  setRegion({
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                },
                error => {
                  Alert.alert(
                    error.message,
                    'Please Switch on your location to get the current location for getting current location.',
                  );
                },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
              );
            }
          } else {
            console.log('ACCESS_FINE_LOCATION permission denied');
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'JallikattuJunction',
                message: 'JallikattuJunction App access to your location ',
              },
            );
          }
        })
        .catch(e => console.log(e));
      // setForm(activeUser);
      // setActiveUser(activeUser);
      ToastAndroid.show(
        'For location update, drag the red marker to the place where you need.',
        ToastAndroid.LONG,
      );
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onSubmit = async () => {
    if (form.firstName.length === 0) {
      ToastAndroid.show('Please Enter First Name', ToastAndroid.SHORT);
      return;
    }
    if (form.email.length === 0) {
      ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
      return;
    }
    if (form.address.door?.length === 0) {
      ToastAndroid.show('Please Enter Door No', ToastAndroid.SHORT);
      return;
    }
    if (form.address.street.length === 0) {
      ToastAndroid.show('Please Enter Street Name', ToastAndroid.SHORT);
      return;
    }
    if (form.address.area.length === 0) {
      ToastAndroid.show('Please Enter Area/Locality Name', ToastAndroid.SHORT);
      return;
    }

    // if(form.ar) {

    // }
    await firestore()
      .collection('users')
      .doc(activeUser.phoneNumber)
      .update({...form, mobile: activeUser.phoneNumber, location: region});
    // navigation.navigate('city-select');
    navigation.navigate('main');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle={'light-content'} />
      <View style={styles.headerContainer}>
        <HeaderLogo />
      </View>
      <ScrollView contentContainerStyle={styles.signupFormContainer}>
        <Text style={styles.signupFromTitleText}>
          You’re just one step away from shopping with us.
        </Text>
        <View style={styles.signupForm}>
          <View style={styles.nameContainer}>
            <View style={[styles.inputContainer, {flex: 1, marginEnd: 20}]}>
              <Text style={styles.inputText}>First Name*</Text>
              <TextInput
                value={form.firstName}
                onChangeText={v => setForm({...form, firstName: v})}
                style={styles.input}
              />
            </View>
            <View style={[styles.inputContainer, {flex: 1}]}>
              <Text style={styles.inputText}>Last Name</Text>
              <TextInput
                value={form.lastName}
                onChangeText={v => setForm({...form, lastName: v})}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Email*</Text>
            <TextInput
              value={form.email}
              onChangeText={v => setForm({...form, email: v})}
              style={styles.input}
            />
          </View>
          <Text style={styles.inputText}>Address*</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputSubText}>Door No*</Text>
            <TextInput
              value={form.address.door}
              onChangeText={v =>
                setForm({...form, address: {...form.address, door: v}})
              }
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputSubText}>Street Name*</Text>
            <TextInput
              value={form.address.street}
              onChangeText={v =>
                setForm({...form, address: {...form.address, street: v}})
              }
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputSubText}>Area/Locality*</Text>
            <TextInput
              value={form.address.area}
              onChangeText={v =>
                setForm({...form, address: {...form.address, area: v}})
              }
              style={styles.input}
            />
          </View>
          <View style={styles.mapOutline}>
            <View style={styles.mapContainer}>
              <MapView
                ref={refMap}
                style={styles.mapStyle}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={true}
                onRegionChangeComplete={region1 => {
                  setRegion({
                    latitude: region1.latitude,
                    longitude: region1.longitude,
                    latitudeDelta: region1.latitudeDelta,
                    longitudeDelta: region1.longitudeDelta,
                  });
                }}
                initialRegion={region}
                region={region}
              />
              <View style={styles.markerFixed}>
                <Image style={styles.marker} source={marker} />
              </View>
            </View>
          </View>
          <SignupButton onPress={onSubmit} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
  },
  mapContainer: {
    // height: '100%',
    // paddingVertical: 500,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapOutline: {
    flex: 1,
    height: 500,
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 23,
  },
  signupFormContainer: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  signupFromTitleText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
  },
  signupForm: {
    flexDirection: 'column',
    marginTop: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
  },
  inputText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#727272',
    marginBottom: 12,
  },
  inputSubText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#777777',
    marginBottom: 12,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 15,
    borderColor: '#c7c7c7',
    paddingHorizontal: 20,
  },
  signupButton: {
    backgroundColor: '#6f0b83',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  signupText: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
  },
});
