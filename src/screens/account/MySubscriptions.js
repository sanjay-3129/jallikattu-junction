import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import BackButton from '../../assets/svg/backbutton.svg';
import Delete from '../../assets/svg/subdelete.svg';
import Pause from '../../assets/svg/subpause.svg';
import Resume from '../../assets/svg/subresume.svg';
import NoSubIcon from '../../assets/svg/nosubs.svg';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';

const MySubscriptions = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const {user} = useSelector(state => state.reducer);

  useEffect(() => {
    const subscriber = firestore()
      .collection('orders')
      .where('mobile', '==', user.mobile)
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        setOrders(data);
      });
    return () => subscriber();
  }, []);

  const deleteSub = async id => {
    await firestore().collection('orders').doc(id).delete();
    ToastAndroid.show('Your Subscription has been deleted', ToastAndroid.SHORT);
  };

  const pauseSub = async id => {
    await firestore().collection('orders').doc(id).update({status: 'Pause'});
    ToastAndroid.show('Your Subscription has been Paused', ToastAndroid.SHORT);
  };

  const resumeSub = async id => {
    await firestore().collection('orders').doc(id).update({status: ''});
    ToastAndroid.show('Your Subscription has been resumed', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscriptions</Text>
        <View />
      </View>
      <View style={styles.subscriptionsContainer}>
        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={item => item.name}
            renderItem={({item}) => {
              return (
                <View style={styles.subscriptionCard}>
                  <View style={styles.subscriptionTypeContainer}>
                    <Text style={styles.subscriptionTypeText}>
                      Subscription Type :
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          color: '#6f0b83',
                        }}>
                        {' '}
                        {item.plan}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.subscriptionInfoContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        style={{height: 100, width: 100}}
                        source={{uri: item.image}}
                      />
                    </View>
                    <View style={styles.subscriptionInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productUnit}>{item.unit}</Text>
                      <Text style={styles.productQty}>
                        Qty : {item.productCount}
                      </Text>
                      <Text style={styles.productPrice}>₹{item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.subButtons}>
                    <TouchableOpacity
                      onPress={() => deleteSub(item.id)}
                      style={styles.subDeleteButton}>
                      <Delete />
                      <Text style={styles.subDeleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    {item.status !== 'Pause' ? (
                      <TouchableOpacity
                        onPress={() => pauseSub(item.id)}
                        style={styles.subPauseButton}>
                        <Pause />
                        <Text style={styles.subPauseButtonText}>Pause</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => resumeSub(item.id)}
                        style={styles.subResumeButton}>
                        <Resume />
                        <Text style={styles.subResumeButtonText}>Play</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <NoSubIcon />
            <Text style={styles.emptyTextTitle}>No Subscriptions Found</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.shopNowButton}>
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MySubscriptions;

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
  subscriptionsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    paddingTop: 35,
    paddingHorizontal: 10,
  },
  subscriptionCard: {
    borderRadius: 5,
    borderColor: '#ffd688',
    borderWidth: 1,
    elevation: 2,
    backgroundColor: 'white',
    flexDirection: 'column',
    marginBottom: 15,
  },
  subscriptionTypeContainer: {
    flexDirection: 'row',
    padding: 15,
  },
  subscriptionTypeText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
  },
  subscriptionInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderTopColor: 'rgba(196, 196, 196, 0.5)',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 5,
  },
  productUnit: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#959595',
    marginBottom: 5,
  },
  productQty: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  subButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  subPauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#d7d7d7',
  },
  subDeleteButtonText: {
    marginLeft: 5,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#6f0b83',
  },
  subPauseButtonText: {
    marginLeft: 5,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#6f0b83',
  },
  subResumeButton: {
    backgroundColor: '#6f0b83',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#6f0b83',
  },
  subResumeButtonText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    marginLeft: 5,
  },
  emptyListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyTextTitle: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginVertical: 20,
  },
  shopNowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#6f0b83',
    borderRadius: 7,
  },
  shopNowButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textTransform: 'uppercase',
  },
});
