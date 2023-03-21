import {
  BackHandler,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import BackButton from '../../assets/svg/backbutton.svg';
import OrderWaitingIcon from '../../assets/svg/orderwaiting.svg';
import OrderDeliveredTick from '../../assets/svg/orderdelivered.svg';
import NoOrdersIcon from '../../assets/svg/noorders.svg';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import HorizontalCalender from '../../components/calender/HorizontalCalender';

const MyOrders = ({route, navigation}) => {
  const [calendarHeaderText, setCalendarHeaderText] = useState('');
  const {user} = useSelector(state => state.reducer);
  const [orders, setOrders] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.navigate('main');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  useEffect(() => {
    let date = new Date(selectedDate);
    if (route.params?.date !== undefined) {
      console.log('route.params.date: ', route.params.date);
      date = new Date(route.params.date);
      console.log('date', date);
    }
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    const subscriber = firestore()
      .collection('orders')
      .where('userDetail.mobile', '==', user.mobile)
      .where('date', '==', `${year}-${month}-${day}`)
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        console.log('myOrders', data);
        setOrders(data);
      });
    return () => subscriber();
  }, []);

  const getOrdersByDate = dateStamp => {
    const date = new Date(dateStamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    console.log('s-date', `${year}-${month}-${day}`);
    firestore()
      .collection('orders')
      .where('userDetail.mobile', '==', user.mobile)
      .where('date', '==', `${year}-${month}-${day}`)
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log('id: ', documentSnapshot.id);
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        if (data.length === 0) {
          ToastAndroid.show(
            'No Orders in the selected date',
            ToastAndroid.SHORT,
          );
        }
        setOrders(data);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <View style={{paddingLeft: 10, paddingTop: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={{flex: 1}}>
          <HorizontalCalender
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getOrders={getOrdersByDate}
          />
        </View>
      </View>
      <View style={styles.ordersContainer}>
        {orders.length > 0 ? (
          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <View style={styles.orderCard} key={item.id}>
                  {item.plan === 'free' ? (
                    item.productInfo.map(prod => {
                      return (
                        <View style={styles.orderInfoContainer}>
                          <View
                            key={prod.id}
                            style={styles.orderImageContainer}>
                            <Image
                              style={{width: '100%', height: 70}}
                              resizeMethod="resize"
                              resizeMode="contain"
                              source={{uri: prod.image}}
                            />
                          </View>
                          <View style={styles.orderInfo}>
                            <Text style={styles.name}>{prod.name}</Text>
                            <Text style={styles.unit}>{item.unit}</Text>
                            <Text style={styles.qty}>
                              Qty : {prod.quantity}
                            </Text>
                          </View>
                          <Text style={styles.price}>₹{prod.price}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.orderInfoContainer}>
                      <View style={styles.orderImageContainer}>
                        <Image
                          style={{width: '100%', height: 70}}
                          resizeMethod="resize"
                          resizeMode="contain"
                          source={{uri: item.productInfo.image}}
                        />
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.name}>{item.productInfo.name}</Text>
                        <Text style={styles.unit}>{item.unit}</Text>
                        <Text style={styles.qty}>
                          Qty : {item.productCount}
                        </Text>
                        <Text style={styles.price}>₹{item.paidAmount}</Text>
                      </View>
                    </View>
                  )}
                  {item.plan === 'free' && (
                    <Text style={styles.price}>
                      Total Amount: ₹{item.paidAmount}
                    </Text>
                  )}
                  <View style={styles.bottomInfo}>
                    <Text style={styles.orderType}>{item.plan}</Text>
                    {item.status === 'booked' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <OrderWaitingIcon />
                        <Text style={styles.orderStatus}>To be delivered</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <OrderDeliveredTick />
                        <Text style={styles.orderStatus}>Delivered</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <NoOrdersIcon />
            <Text style={styles.emptyTextTitle}>No Orders Found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textTransform: 'uppercase',
  },
  ordersContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    padding: 20,
  },
  orderCard: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffd688',
    elevation: 2,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  orderInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  orderImageContainer: {
    flex: 1,
  },
  orderInfo: {
    flex: 2,
  },
  name: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 5,
  },
  unit: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#959595',
    marginBottom: 5,
  },
  qty: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    marginBottom: 5,
  },
  price: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 5,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 6,
    borderTopColor: 'rgba(196, 196, 196, 0.5)',
  },
  orderType: {
    flex: 1,
    backgroundColor: '#6f0b83',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  orderStatus: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#878787',
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
  },
});
