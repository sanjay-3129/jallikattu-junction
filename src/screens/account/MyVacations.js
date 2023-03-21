import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../../assets/svg/backbutton.svg';
import NoVacations from '../../assets/svg/novacations.svg';
import firestore from '@react-native-firebase/firestore';
import CalenderModal from '../../components/Modal/CalenderModal';
import {useSelector} from 'react-redux';

const MyVacations = ({navigation}) => {
  const [modal, showModal] = useState(false);

  const [selectedDates, setSelectedDates] = useState({});
  const [addedVacations, setAddedVacations] = useState({});
  const [vacations, setVacations] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const {user} = useSelector(state => state.reducer);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(user.mobile)
      .collection('vacations')
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        setVacations(data);
      });
    return () => subscriber();
  }, [addedVacations, refresh]);

  const saveVacations = async () => {
    await firestore()
      .collection('users')
      .doc(user.mobile)
      .collection('vacations')
      .add(addedVacations);
    setSelectedDates({});
    ToastAndroid.show(
      'Your vacation list has been updated',
      ToastAndroid.SHORT,
    );
  };

  const removeTheVacation = async id => {
    await firestore()
      .collection('users')
      .doc(user.mobile)
      .collection('vacations')
      .doc(id)
      .delete();
    ToastAndroid.show('Your Vacation has been removed', ToastAndroid.SHORT);
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (addedVacations.start) {
      saveVacations();
    }
  }, [addedVacations]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vacations</Text>
        <View />
      </View>
      <View style={styles.vacationsContainer}>
        {vacations.length > 0 ? (
          <View>
            <FlatList
              data={vacations}
              keyExtractor={item => item.id}
              ListFooterComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={() => showModal(true)}
                    style={styles.addVacationButton}>
                    <Text style={styles.addVacationButtonText}>
                      Add Vacation
                    </Text>
                  </TouchableOpacity>
                );
              }}
              renderItem={({item}) => {
                return (
                  <View style={styles.vacationListCard}>
                    <View style={styles.vacationDates}>
                      <Text
                        style={[
                          styles.vacationDate,
                          {fontSize: 15, lineHeight: 18, color: 'black'},
                        ]}>
                        {new Date(item.start)
                          .getDate()
                          .toString()
                          .padStart(2, '0') +
                          '-' +
                          (new Date(item.start).getMonth() + 1)
                            .toString()
                            .padStart(2, '0') +
                          '-' +
                          new Date(item.start).getFullYear()}
                      </Text>
                      {item.end && <Text style={styles.vacationDate}>to</Text>}
                      {item.end && (
                        <Text
                          style={[
                            styles.vacationDate,
                            {fontSize: 15, lineHeight: 18, color: 'black'},
                          ]}>
                          {new Date(item.end)
                            .getDate()
                            .toString()
                            .padStart(2, '0') +
                            '-' +
                            (new Date(item.end).getMonth() + 1)
                              .toString()
                              .padStart(2, '0') +
                            '-' +
                            new Date(item.end).getFullYear()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.endButtonContainer}>
                      <TouchableOpacity
                        onPress={() => removeTheVacation(item.id)}
                        style={styles.endButton}>
                        <Text style={styles.endButtonText}>End</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={styles.emptyListContainer}>
            <View />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <NoVacations />
              <Text style={styles.emptyTextTitle}>
                You have no vacations added
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => showModal(true)}
              style={styles.addVacationButton}>
              <Text style={styles.addVacationButtonText}>Add Vacation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <CalenderModal
        show={modal}
        close={showModal}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        setAddedVacations={setAddedVacations}
      />
    </View>
  );
};

export default MyVacations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
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
  vacationsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    padding: 20,
  },

  emptyListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  emptyTextTitle: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginVertical: 20,
  },
  addVacationButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#6f0b83',
    borderRadius: 7,
    width: '100%',
  },
  addVacationButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  vacationListCard: {
    borderWidth: 1,
    borderColor: '#ffd688',
    borderRadius: 5,
    backgroundColor: 'white',
    elevation: 5,
    paddingVertical: 10,
    marginBottom: 20,
  },
  vacationDates: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  vacationDate: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: 'grey',
    textAlign: 'center',
  },
  endButtonContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopColor: '#d7d7d7',
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  endButton: {
    backgroundColor: '#6f0b83',
    borderRadius: 5,
  },
  endButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
  },
});
