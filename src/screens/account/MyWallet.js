import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import RazorpayCheckout from 'react-native-razorpay';
import BackButton from '../../assets/svg/backbutton.svg';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/actions';

const MyWallet = ({navigation}) => {
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [walletInput, setWalletInput] = useState(0);
  const {user} = useSelector(state => state.reducer);
  const dispatch = useDispatch();

  const getWalletBalance = async () => {
    const doc = await firestore().collection('users').doc(user.mobile).get();
    let value = doc.data();
    let wallet = value?.wallet ? value?.wallet : 0;
    setWalletBalance(wallet);
  };

  useEffect(() => {
    getWalletBalance();
  }, []);

  const addMoney = () => {
    var options = {
      description: 'Jallikattu Junction',
      image:
        'https://firebasestorage.googleapis.com/v0/b/jallikattujn.appspot.com/o/Jallikattu%20logo%201.png?alt=media&token=dacf5d91-98f7-4603-beb8-381150e05111',
      currency: 'INR',
      // key: 'rzp_live_7c5hOr1Q4htb8R',
      key: 'rzp_test_nBjaWpeclrytUx',
      amount: (walletInput * 100).toString(),
      name: 'Jallikattu Junction',
      prefill: {
        email: user.email,
        contact: user.mobile,
        name: user.firstName + ' ' + user.lastName,
      },
      theme: {color: '#6f0b83'},
    };
    RazorpayCheckout.open(options)
      .then(async data => {
        console.log(data);
        setWalletInput('');
        setWalletBalance(parseFloat(walletInput) + parseFloat(walletBalance));
        await firestore()
          .collection('users')
          .doc(user.mobile)
          .update({
            wallet: parseFloat(walletInput) + parseFloat(walletBalance),
          });
        dispatch(
          setUser({
            ...user,
            wallet: parseFloat(walletInput) + parseFloat(walletBalance),
          }),
        );
      })
      .catch(error => {
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View />
      </View>
      <View style={styles.walletContainer}>
        <View style={styles.walletBalanceContainer}>
          <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
          <Text style={styles.walletBalance}>₹{walletBalance}</Text>
        </View>
        <View style={styles.addMoneySection}>
          <Text style={styles.addMoneyTitle}>Add Money</Text>
          <View style={styles.addMoneyCard}>
            <TextInput
              style={styles.addMoneyInput}
              placeholder="Enter Amount"
              keyboardType="number-pad"
              returnKeyType="send"
              onSubmitEditing={() =>
                parseInt(walletInput) >= 500
                  ? addMoney()
                  : ToastAndroid.show(
                      'Please add at least ₹500',
                      ToastAndroid.SHORT,
                    )
              }
              value={walletInput.toString()}
              onChangeText={v => setWalletInput(v)}
            />
            <View style={styles.addMoneySuggestionsContainer}>
              <TouchableOpacity
                onPress={() => setWalletInput('500')}
                style={styles.addMoneySuggestionButton}>
                <Text style={styles.addMoneySuggestionText}>+ ₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWalletInput('1000')}
                style={styles.addMoneySuggestionButton}>
                <Text style={styles.addMoneySuggestionText}>+ ₹1000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWalletInput('2000')}
                style={styles.addMoneySuggestionButton}>
                <Text style={styles.addMoneySuggestionText}>+ ₹2000</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                parseInt(walletInput) >= 500
                  ? addMoney()
                  : ToastAndroid.show(
                      'Please add at least ₹500',
                      ToastAndroid.SHORT,
                    )
              }
              style={styles.addMoneyButton}>
              <Text style={styles.addMoneyButtonText}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.otherOptionsContainer}>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show(
                'You have no recharge history',
                ToastAndroid.SHORT,
              );
            }}
            style={styles.history}>
            <Text style={styles.historyText}>Recharge History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show(
                'You have no billing history',
                ToastAndroid.SHORT,
              );
            }}
            style={styles.history}>
            <Text style={styles.historyText}>Billing History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyWallet;

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
  walletContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    paddingTop: 35,
    paddingHorizontal: 10,
  },
  walletBalanceContainer: {
    marginTop: 45,
    alignItems: 'center',
  },
  walletBalanceTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Medium',
    color: '#777777',
    marginBottom: 15,
  },

  walletBalance: {
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  addMoneySection: {
    marginTop: 40,
  },
  addMoneyTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#777777',
  },
  addMoneyCard: {
    borderRadius: 20,
    elevation: 1,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#c4c4c4',
    padding: 15,
    marginTop: 10,
  },
  addMoneyInput: {
    borderBottomWidth: 1,
    padding: 0,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    borderBottomColor: '#c4c4c4',
  },
  addMoneySuggestionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addMoneySuggestionButton: {
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: '#c4c4c4',
  },
  addMoneySuggestionText: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: 'Montserrat-Bold',
    color: '#9e9e9e',
  },
  addMoneyButton: {
    borderRadius: 40,
    backgroundColor: '#6f0b83',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  addMoneyButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
  },
  otherOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  history: {
    backgroundColor: '#6f0b83',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    height: 50,
  },
  historyText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
