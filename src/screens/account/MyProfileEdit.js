import {
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  SafeAreaView,
  View,
  PermissionsAndroid,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import BackButton from '../../assets/svg/backbutton.svg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
// Import Map and Marker
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import marker from '../../assets/icons8-marker.png';

const SaveButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.signupButton}>
      <Text style={styles.signupText}>SAVE</Text>
    </TouchableOpacity>
  );
};

const MyProfile = ({navigation}) => {
  const {user} = useSelector(state => state.reducer);
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
  // const [center, setCenter] = useState(null);

  useEffect(() => {
    // check user, whether the lat and long is already there and set if its there
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted) {
          console.log('You can use the ACCESS_FINE_LOCATION');
          console.log('user', user);
          if (user?.location) {
            // setMarkerRegion(user.location);
            setRegion({
              ...user.location,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          } else {
            Geolocation.getCurrentPosition(
              pos => {
                const crd = pos.coords;
                // console.log('geolo', crd);
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
                  'Please Switch on your location to get the current location for getting address, if not updating addres please ignore this message.',
                );
              },
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
          }
          // Geolocation.requestAuthorization();
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
    setForm(user);
    setActiveUser(user);
    ToastAndroid.show(
      'For location update, drag the red marker to the place where you need.',
      ToastAndroid.LONG,
    );
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const onSubmit = async () => {
    if (form.firstName.length === 0) {
      ToastAndroid.show('Please Enter First Name', ToastAndroid.SHORT);
      return;
    }
    if (form.email.length === 0) {
      ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
      return;
    }
    if (form.address.door.length === 0) {
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

    await firestore()
      .collection('users')
      .doc(activeUser.mobile)
      .set({...form, mobile: activeUser.mobile, location: region});
    ToastAndroid.show(
      'Your Profile has been updated successfully',
      ToastAndroid.SHORT,
    );
    goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View />
      </View>
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
                // setMarkerRegion({
                //   latitude: region1.latitude,
                //   longitude: region1.longitude,
                // });
              }}
              initialRegion={region}
              region={region}>
              {/* <Marker
                draggable
                coordinate={{
                  latitude: markerRegion.latitude,
                  longitude: markerRegion.longitude,
                }}
                onDragEnd={e => {
                  setMarkerRegion(e.nativeEvent.coordinate);
                }}
                title={'Your delivery location'}
                description={'Please select your delivery location...'}
              /> */}
            </MapView>
            <View style={styles.markerFixed}>
              <Image style={styles.marker} source={marker} />
            </View>
            {/* <SafeAreaView style={styles.footer}>
              <Text style={styles.region}>
                {JSON.stringify(region, null, 2)}
              </Text>
            </SafeAreaView> */}
          </View>
        </View>
        <SaveButton onPress={onSubmit} />
      </View>
    </ScrollView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#6f0b83',
    // flexDirection: 'column',
    // height: '100%',
    justifyContent: 'space-between',
  },
  mapContainer: {
    height: '100%',
    // paddingVertical: 500,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
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
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20,
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
  signupForm: {
    flexDirection: 'column',
    paddingHorizontal: 30,
    paddingTop: 45,
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
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
    paddingHorizontal: 20,
    borderColor: '#c7c7c7',
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
