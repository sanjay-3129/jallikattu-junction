import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Image,
  Pressable,
  View,
} from 'react-native';
import Gift from '../../assets/svg/Gift.svg';
// import Wallet from '../../assets/svg/wallet.svg';
const CongratsModal = ({isNew, setIsNew}) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(isNew);
  }, [isNew]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          // setModalVisible(!modalVisible);
          setIsNew(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.row}>
              <Image
                style={styles.crack1}
                source={require('../../assets/svg/party-popper.png')}
              />
              <Text style={styles.modalText}>Congratulations</Text>
              {/* <Gift/> */}
              <Image
                style={styles.crack2}
                source={require('../../assets/svg/party.png')}
              />
            </View>
            <Text style={styles.modalText}>
              You have unlocked free milk and curd for 7 days!*
            </Text>
            <Text style={styles.modalText}>
              Our representatives will call you shortly
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                console.log('hide');
                // setModalVisible(!modalVisible);
                setIsNew(!modalVisible);
              }}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => {
          console.log('open');
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 240,
    // backgroundColor: '#f3f3f3',
    width: 390,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    fontSize: 18,
    // backgroundColor: '#6f0b83',
  },
  // buttonOpen: {
  //   backgroundColor: '#6f0b83',
  // },
  buttonClose: {
    backgroundColor: '#6f0b83',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  crack1: {
    width: 25,
    height: 25,
    padding: 5,
    marginRight: 20,
  },
  crack2: {
    width: 25,
    height: 25,
    padding: 5,
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

export default CongratsModal;
