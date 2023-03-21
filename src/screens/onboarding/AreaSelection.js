import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HeaderLogo from '../../assets/svg/headerlogo.svg';
import Search from '../../assets/svg/jksearch.svg';
import {useDispatch} from 'react-redux';

const AreaSearchInput = () => {
  return (
    <View style={styles.inputContainer}>
      <TextInput style={styles.input} />
      <View style={styles.searchIcon}>
        <Search />
      </View>
    </View>
  );
};

const AreaSelection = ({navigation, route}) => {
  const {params = {}} = route;
  const {cities = []} = params;
  const [activeUser, setActiveUser] = useState({});
  // const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    if (user) {
      setActiveUser(user);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('area-select');
    return subscriber;
  }, []);

  const onAreaSelect = async name => {
    // if (
    //   name === 'Ashok Nagar' ||
    //   name === 'KK Nagar' ||
    //   name === 'West Mambalam'
    // ) {
    //   await firestore().collection('users').doc(activeUser.phoneNumber).update({
    //     area: name,
    //     isNew: true,
    //   });
    // } else {
    //   await firestore()
    //     .collection('users')
    //     .doc(activeUser.phoneNumber)
    //     .update({area: name});
    // }
    await firestore()
      .collection('users')
      .doc(activeUser.phoneNumber)
      .update({area: name});
    // navigation.navigate('main');
    navigation.navigate('signup');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle={'light-content'} />
      <View style={styles.headerContainer}>
        <HeaderLogo />
      </View>
      <View style={styles.citiesContainer}>
        <Text style={styles.selectCitiesTitle}>Select your locality</Text>
        <View>
          <AreaSearchInput />
        </View>
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={cities}
          style={{width: '80%', marginTop: 30}}
          keyExtractor={item => item.name}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => onAreaSelect(item.name)}
                style={styles.cityListItem}>
                <Text style={styles.cityListItemText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default AreaSelection;

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
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#c4c4c4',
    marginTop: 30,
  },
  input: {
    width: '80%',
    paddingStart: 35,
  },
  searchIcon: {
    position: 'absolute',
    top: '30%',
    left: 10,
  },
  cityListItem: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingBottom: 18,
    borderBottomColor: '#c4c4c4',
  },
  cityListItemText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Medium',
    fontStyle: 'italic',
    color: 'black',
  },
  flatListContent: {
    flex: 1,
  },
});
