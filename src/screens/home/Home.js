import {
  BackHandler,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setDrawerVisibility, setUser} from '../../redux/actions';
import Clock from '../../assets/svg/clock.svg';
import LegendBall from './LegendBall';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import DrawerModal from '../../components/Modal/DrawerModal';
import HorizontalCalender from '../../components/calender/HorizontalCalender';
import Carousel from 'react-native-snap-carousel';
import CongratsModal from '../../components/Modal/CongratsModal';

const Home = ({navigation, route}) => {
  const {params = {}} = route;
  const {phoneNumber} = params;
  const [isNew, setIsNew] = useState(false);
  const dispatch = useDispatch();

  const onAuthStateChanged = async user => {
    if (user) {
      // setIsNew(true); // to test modal
      const doc = await firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .get();
      let userDetail = doc.data();
      console.log('Home', user.phoneNumber, userDetail);
      if (userDetail) {
        // check if location is enabled or not
        if (userDetail.location === undefined || userDetail.location === null) {
          Alert.alert('Add location', 'Please update your location.', [
            {text: 'OK', onPress: () => navigation.navigate('profile')},
          ]);
        }
        // console.log('new user: ', userDetail?.isNew);
        if (userDetail?.isNew !== undefined && userDetail?.isNew === true) {
          // to open congrats modal
          // console.log('new user: came in and new user false');
          setIsNew(true);
          // change new user to false
          firestore()
            .collection('users')
            .doc(user.phoneNumber)
            .update({
              isNew: false,
            })
            .then(() => {
              userDetail = {
                ...userDetail,
                isNew: false,
              };
              // console.log('successfully updated');
              // if clicked ok, then push an order
              dispatch(setUser(userDetail));
              AsyncStorage.setItem('user', JSON.stringify(userDetail));
              // add orders for 7days
              let listPromises = [];
              let productInfo = [
                {
                  id: 'vxqXbZdovOm4IcpAYQ9k',
                  name: 'Standard Milk',
                  price: 29,
                  description:
                    'Standardised Milk means cow milk or buffalo milk or sheep milk or goat milk or a combination of any of these milk that has been standardised to fat and solids-not-fat percentage given in the table below in 1.0 by the adjustment of milk solids.',
                  image:
                    'https://firebasestorage.googleapis.com/v0/b/jallikattujn.appspot.com/o/products%2FJN-SM.png?alt=media&token=567f6809-a38e-4abb-bc3a-03d4edd4b2a8',
                  quantity: 1,
                  unit: '500ml',
                },
                {
                  id: 'YktvjU7FlGEZsawdqypI',
                  name: 'Cup Curd',
                  price: 12,
                  description:
                    'Made from farm-fresh milk, this thick, creamy and delicious curd is wholesome and filled with the goodness of probiotics. Make Jallikattu curd an everyday addition to your diet!',
                  image:
                    'https://firebasestorage.googleapis.com/v0/b/jallikattujn.appspot.com/o/products%2FJN-Curd.png?alt=media&token=b7520c9e-d9e4-4e6d-b6dc-966b226072f8',
                  quantity: 1,
                  unit: '100gm',
                },
              ];
              let productCount = 1;
              firestore()
                .collection('appMeta')
                .doc('settings')
                .get()
                .then(document => {
                  let settings = document.data();
                  setBannerDetails(settings.banner);
                  let freeDateRange = settings.freeProductsDate;
                  let startDate = new Date(freeDateRange.start);
                  let endDate = new Date(freeDateRange.end);
                  endDate.setHours(endDate.getHours() + 14); // why 15, to make it IST
                  endDate.setMinutes(endDate.getMinutes() + 30);
                  let date = new Date();
                  const currentTime = date.getTime();
                  if (
                    currentTime >= startDate.getTime() &&
                    currentTime < endDate.getTime()
                  ) {
                    // if (hour < 20) {
                    // before 8pm, order from tmrw
                    let orderDate = new Date('2022-06-19'); // why 19 -> bcs we are incrementing to 1 date extra
                    for (let i = 0; i < 7; i++) {
                      orderDate.setDate(orderDate.getDate() + 1);
                      let year = orderDate.getFullYear();
                      let month = orderDate.getMonth() + 1;
                      if (month < 10) {
                        month = '0' + month;
                      }
                      let day = orderDate.getDate();
                      if (day < 10) {
                        day = '0' + day;
                      }
                      // console.log('free date: ', `${year}-${month}-${day}`);
                      // dont uncomment it, it moves to live data
                      listPromises.push(
                        firestore()
                          .collection('orders')
                          // .collection('testOrders')
                          .add({
                            userDetail,
                            productInfo,
                            productCount,
                            paidAmount: 41,
                            // paidAmount: productCount * totalDays * price,
                            status: 'booked',
                            // unit: '250 ml',
                            plan: 'free',
                            date: `${year}-${month}-${day}`,
                          }),
                      );
                    }
                    Promise.all(listPromises)
                      .then(values => {
                        values.forEach((c, i) => {
                          // console.log('Added, ', i);
                          // setIsNew(false);
                        });
                      })
                      .catch(e => console.log(e));
                  }
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        } else {
          dispatch(setUser(userDetail));
          AsyncStorage.setItem('user', JSON.stringify(userDetail));
          firestore()
            .collection('appMeta')
            .doc('settings')
            .get()
            .then(document => {
              let settings = document.data();
              setBannerDetails(settings.banner);
            })
            .catch(e => console.log(e));
        }
      }
    } else {
      firestore()
        .collection('appMeta')
        .doc('settings')
        .get()
        .then(document => {
          let settings = document.data();
          setBannerDetails(settings.banner);
        })
        .catch(e => console.log(e));
      const doc = await firestore()
        .collection('users')
        .doc(phoneNumber.length > 10 ? `${phoneNumber}` : `+91${phoneNumber}`)
        .get();
      console.log('Home-: ', doc.data(), phoneNumber);
      if (doc.data()) {
        dispatch(setUser(doc.data()));
        AsyncStorage.setItem('user', JSON.stringify(doc.data()));
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

  const openDrawer = () => {
    dispatch(setDrawerVisibility(true));
  };

  const [products, setProducts] = useState([]);
  const [orderTime, setOrderTime] = useState(new Date());
  const [bannerDetails, setBannerDetails] = useState([]);

  const getOrderTime = async () => {
    const doc = await firestore().collection('appMeta').doc('settings').get();
    setOrderTime(doc.data().orderTime.seconds);
  };

  const getBannerImage = async () => {
    const doc = await firestore().collection('appMeta').doc('settings').get();
    setBannerDetails(doc.data().banner);
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        setProducts(data);
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    getOrderTime();
    getBannerImage();
  }, []);

  const getStringifiedTime = seconds => {
    const date = new Date(seconds * 1000);
    const hours = date.getHours();
    const actualTimeIn12Hrs = hours > 12 ? hours - 12 : hours;
    const meridian = hours > 12 ? 'PM' : 'AM';

    return (
      actualTimeIn12Hrs.toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0') +
      ' ' +
      meridian
    );
  };

  const openProductDetails = (productInfo, id) => {
    if (id) {
      navigation.navigate('product', {id});
      return;
    }
    navigation.navigate('product', {productInfo});
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <HomeHeader openDrawer={openDrawer} />
      {/* <View>
        <HorizontalCalender />
      </View> */}
      {/* <View style={styles.calendarLegends}>
        <View style={styles.calendarLegend}>
          <LegendBall color="#00ff47" />
          <Text style={styles.calendarLegendText}>Delivered</Text>
        </View>
        <View style={styles.calendarLegend}>
          <LegendBall color="#00d1ff" />
          <Text style={styles.calendarLegendText}>Upcoming</Text>
        </View>
        <View style={styles.calendarLegend}>
          <LegendBall color="#ffd600" />
          <Text style={styles.calendarLegendText}>Vacation</Text>
        </View>
      </View> */}
      <CongratsModal isNew={isNew} setIsNew={setIsNew} />
      <View style={styles.productsContainer}>
        <FlatList
          data={products}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <View>
                <View style={{borderRadius: 20}}>
                  <Carousel
                    data={bannerDetails}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        // onPress={() => openProductDetails('', item.id)}
                        style={styles.banner}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                          }}
                          source={{uri: item.image}}
                        />
                      </TouchableOpacity>
                    )}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width}
                  />
                </View>

                <View style={styles.notifyTextContainer}>
                  <Clock />
                  <Text style={styles.notifyText}>
                    Order up to {getStringifiedTime(orderTime)} for next day
                    delivery.
                  </Text>
                </View>
              </View>
            );
          }}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => openProductDetails(item)}
                style={styles.product}>
                <View style={styles.productImageContainer}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={{uri: item.image}}
                  />
                </View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  {item.prices[0].unit} - ₹{item.prices[0].price}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <DrawerModal />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  walletButton: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  walletAmount: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    marginLeft: 5,
  },
  calendarLegends: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 15,
  },
  calendarLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarLegendText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    marginLeft: 5,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexDirection: 'column',
    paddingTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  banner: {
    height: 140,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 10,
  },
  notifyTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  notifyText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    marginLeft: 7,
  },
  product: {
    width: 150,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderColor: '#ffd688',
    borderWidth: 0.8,
    marginRight: 12,
    marginBottom: 20,
    padding: 15,
  },
  productImageContainer: {
    height: 80,
    width: 80,
  },
  productName: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
  },
});
