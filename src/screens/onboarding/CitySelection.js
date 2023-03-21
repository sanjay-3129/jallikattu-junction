import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import HeaderLogo from '../../assets/svg/headerlogo.svg';
import auth from '@react-native-firebase/auth';

const CitySelection = ({navigation}) => {
  const [activeUser, setActiveUser] = useState({});
  const [areas, setAreas] = useState([]);

  const onAuthStateChanged = user => {
    if (user) {
      setActiveUser(user);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('deliveringareas')
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        setAreas(data);
      });
    return () => subscriber();
  }, []);

  const onCitySelect = async name => {
    await firestore()
      .collection('users')
      .doc(activeUser.phoneNumber)
      .set({city: name, mobile: activeUser.phoneNumber});
    navigation.navigate('area-select', {
      cities: areas.filter(e => e.name === name)[0]?.cities,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle={'light-content'} />
      <View style={styles.headerContainer}>
        <HeaderLogo />
      </View>
      <View style={styles.citiesContainer}>
        <Text style={styles.selectCitiesTitle}>Select your city</Text>
        <View style={styles.citiesListContainer}>
          {areas.map(area => (
            <TouchableOpacity
              key={area.id}
              onPress={() => onCitySelect(area.name)}
              style={styles.cityButton}>
              <View style={styles.cityImageHolder}>
                <Image source={require('../../assets/chennaiicon.png')} />
              </View>
              <Text style={styles.cityTitle}>{area.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CitySelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 23,
  },
  citiesContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
  selectCitiesTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
  },
  citiesListContainer: {
    margin: 20,
  },
  cityButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cityImageHolder: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
    borderColor: '#ffd688',
  },
  cityTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'italic',
    color: 'black',
    marginTop: 10,
  },
});
