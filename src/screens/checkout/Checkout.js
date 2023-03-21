import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  Text,
} from 'react-native';
import HeaderLogo from '../../assets/svg/headerlogo.svg';
import RazorpayCheckout from 'react-native-razorpay';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Checkout = ({route, navigation}) => {
  const {params = {}} = route;
  const {user} = useSelector(state => state.reducer);
  const {
    productInfo,
    selectedPlan,
    numberOfWeeks,
    selectedMultipleDates,
    selectedCustomDays,
    totalDays,
    productCount,
    unit,
    price,
  } = params;

  const proceed = async () => {
    console.log('selectedPlanaa', selectedPlan);
    if (selectedPlan !== 'One Time') {
      // const doc = await firestore().collection('users').doc(user.mobile).get();
      // if (doc?.data()?.wallet >= totalDays * productCount * price) {
      //   await firestore()
      //     .collection('orders')
      //     .add({
      //       user,
      //       productInfo,
      //       productCount,
      //       paidAmount: productCount * totalDays * price,
      //       unit,
      //       date: new Date().setHours(0, 0, 0, 0).toString(),
      //       plan: selectedPlan,
      //     });
      //   navigation.navigate('orders');
      // } else {
      //   ToastAndroid.show(
      //     'Not enough balance in the wallet',
      //     ToastAndroid.SHORT,
      //   );
      //   navigation.navigate('wallet');
      // }

      console.log('selectedPlan: ', selectedPlan, productInfo);
      console.log(
        'noOfWeeks: ',
        numberOfWeeks,
        totalDays,
        unit,
        price,
        productCount,
      );
      console.log('selectedCustomDays', selectedCustomDays);
      console.log('selectedMultipleDates', selectedMultipleDates);
      let startDate = new Date(selectedMultipleDates.start);
      let endDate = new Date(selectedMultipleDates.end);
      console.log('start', startDate.getDate(), endDate.getDate());
      if (selectedPlan === 'Daily') {
        ToastAndroid.show(
          'This feature will be enabled soon, Please try One Time',
          ToastAndroid.LONG,
        );
        // let orderDate = new Date(startDate.getTime());
        // let startTime = orderDate.getTime();
        // let endTime = endDate.getTime();
        // for (let i = 0; i < totalDays + 1; i++) {
        //   let year = orderDate.getFullYear();
        //   let month = orderDate.getMonth() + 1;
        //   if (month < 10) {
        //     month = '0' + month;
        //   }
        //   let day = orderDate.getDate();
        //   if (day < 10) {
        //     day = '0' + day;
        //   }
        //   console.log(`${year}-${month}-${day}`);
        //   orderDate.setDate(orderDate.getDate() + 1);
        // }
        // while (startTime < endTime) {
        //   startTime = orderDate.getTime();
        //   let year = orderDate.getFullYear();
        //   let month = orderDate.getMonth() + 1;
        //   if (month < 10) {
        //     month = '0' + month;
        //   }
        //   let day = orderDate.getDate();
        //   if (day < 10) {
        //     day = '0' + day;
        //   }
        //   console.log(`${year}-${month}-${day}`);
        //   orderDate.setDate(orderDate.getDate() + 1);
        // }
      } else if (selectedPlan === 'Alternative Days') {
        ToastAndroid.show(
          'This feature will be enabled soon, Please try One Time',
          ToastAndroid.LONG,
        );
        // let orderDate = new Date(startDate.getTime());
        // let startTime = orderDate.getTime();
        // let endTime = endDate.getTime();
        // while (startTime < endTime) {
        //   startTime = orderDate.getTime();
        //   let year = orderDate.getFullYear();
        //   let month = orderDate.getMonth() + 1;
        //   if (month < 10) {
        //     month = '0' + month;
        //   }
        //   let day = orderDate.getDate();
        //   if (day < 10) {
        //     day = '0' + day;
        //   }
        //   console.log(`${year}-${month}-${day}`);
        //   orderDate.setDate(orderDate.getDate() + 2);
        // }
      } else if (selectedPlan === 'Monthly') {
        console.log('params', startDate, startDate.getDate());
        // ToastAndroid.show(
        //   'This feature will be enabled soon, Please try One Time',
        //   ToastAndroid.LONG,
        // );
        // pay money to razorpay, generate orders, if vacation, then refund at end
        var options = {
          description: 'Jallikattu Junction',
          image:
            'https://firebasestorage.googleapis.com/v0/b/jallikattujn.appspot.com/o/Jallikattu%20logo%201.png?alt=media&token=dacf5d91-98f7-4603-beb8-381150e05111',
          currency: 'INR',
          key: 'rzp_live_7c5hOr1Q4htb8R',
          // key: 'rzp_test_nBjaWpeclrytUx',
          amount: (productCount * (totalDays - 5) * price * 100).toString(),
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
            // if month order starting date is from tomorrow
            let listPromises = [];
            let orderDate = new Date(selectedMultipleDates.start);
            let start = '';
            let end = '';
            for (let i = 0; i < totalDays; i++) {
              let year = orderDate.getFullYear();
              let month = orderDate.getMonth() + 1;
              if (month < 10) {
                month = '0' + month;
              }
              let day = orderDate.getDate();
              if (day < 10) {
                day = '0' + day;
              }
              if (i === 0) {
                start = `${day}-${month}-${year}`;
              } else if (i === totalDays - 1) {
                end = `${day}-${month}-${year}`;
              }
              // console.log(`${day}-${month}-${year}`);
              listPromises.push(
                firestore()
                  .collection('orders')
                  .add({
                    userDetail: user,
                    productInfo,
                    productCount,
                    paidAmount: productCount * (totalDays - 5) * price,
                    unit,
                    status: 'booked',
                    plan: selectedPlan,
                    date: `${year}-${month}-${day}`,
                    razorypayDetails: data,
                  }),
              );
              orderDate.setDate(orderDate.getDate() + 1);
            }
            Promise.all(listPromises)
              .then(values => {
                // values.forEach((c, i) => {
                //   console.log('Added, ', i);
                // });
                // sendMail
                const value = {
                  userDetail: user,
                  productInfo,
                  productCount,
                  paidAmount: productCount * (totalDays - 5) * price,
                  unit,
                  status: 'booked',
                  plan: selectedPlan,
                  date: `${start} to ${end}`,
                  razorpayDetails: data,
                };
                const customHeaders = {
                  'Content-Type': 'application/json',
                };
                const url =
                  'https://us-central1-jallikattujn.cloudfunctions.net/api/sendMail';
                fetch(url, {
                  method: 'POST',
                  headers: customHeaders,
                  body: JSON.stringify(value),
                })
                  .then(response => {
                    response.json();
                  })
                  .then(datas => {
                    console.log('sendMail data: ', datas);
                    navigation.navigate('orders');
                  });
              })
              .catch(e => console.log(e));
          })
          .catch(error => {
            console.log(error);
          });
      } else if (selectedPlan === 'Custom') {
        ToastAndroid.show(
          'This feature will be enabled soon, Please try One Time',
          ToastAndroid.LONG,
        );
      }
    } else {
      console.log('oneTime: ', productCount, totalDays, price);
      var options = {
        description: 'Jallikattu Junction',
        image:
          'https://firebasestorage.googleapis.com/v0/b/jallikattujn.appspot.com/o/Jallikattu%20logo%201.png?alt=media&token=dacf5d91-98f7-4603-beb8-381150e05111',
        currency: 'INR',
        key: 'rzp_live_7c5hOr1Q4htb8R',
        // key: 'rzp_test_nBjaWpeclrytUx',
        amount: (productCount * totalDays * price * 100).toString(),
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
          let orderDate = new Date();
          let hour = orderDate.getHours();
          let date = '';
          // let orderDates = [];
          // let orderDatesWithStatus = [];
          if (hour < 20) {
            // tommorow
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
            date = `${year}-${month}-${day}`;
          } else {
            ToastAndroid.show(
              "You've registered after 8pm, So we can't deliver the free items tommorrow. You'll get it day after tommorrow",
              ToastAndroid.LONG,
            );
            orderDate.setDate(orderDate.getDate() + 2); // day after tommorow - 2
            let year = orderDate.getFullYear();
            let month = orderDate.getMonth() + 1;
            if (month < 10) {
              month = '0' + month;
            }
            let day = orderDate.getDate();
            if (day < 10) {
              day = '0' + day;
            }
            date = `${year}-${month}-${day}`;
          }
          await firestore()
            .collection('orders')
            .add({
              userDetail: user,
              productInfo,
              productCount,
              paidAmount: productCount * totalDays * price,
              unit,
              status: 'booked',
              plan: selectedPlan,
              date,
              razorypayDetails: data,
            })
            .catch(e => console.log(e));
          const value = {
            userDetail: user,
            productInfo,
            productCount,
            paidAmount: productCount * totalDays * price,
            unit,
            status: 'booked',
            plan: selectedPlan,
            date,
            razorpayDetails: data,
          };
          const customHeaders = {
            'Content-Type': 'application/json',
          };
          const url =
            'https://us-central1-jallikattujn.cloudfunctions.net/api/sendMail';
          // const url =
          //   'http://localhost:5001/jallikattujn/us-central1/api/sendMail';
          fetch(url, {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(value),
          })
            .then(response => {
              response.json();
            })
            .then(datas => {
              console.log('sendMail data - onetime: ', datas);
              navigation.navigate('orders');
            })
            .catch(e => console.log('onetime sendMail err: ', e));
          // navigation.navigate('orders');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle={'light-content'} />
      <View style={styles.headerContainer}>
        <HeaderLogo />
      </View>

      <View style={styles.checkoutContainer}>
        <View
          style={{
            padding: 20,
            elevation: 4,
            backgroundColor: 'white',
            marginHorizontal: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 19,
              color: '#000000',
              fontFamily: 'Montserrat-Bold',
            }}>
            {selectedPlan === 'One Time'
              ? 'Purchase Details'
              : 'Subscription Details'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Plan Type
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#ffffff',
                padding: 5,
                borderRadius: 5,
                backgroundColor: '#6f0b83',
                fontFamily: 'Montserrat-Bold',
              }}>
              {selectedPlan}
            </Text>
          </View>
          {selectedPlan !== 'One Time' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000000',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Duration
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: 'black',
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#dddddd90',
                  fontFamily: 'Montserrat-Bold',
                  marginTop: selectedPlan === 'Custom' ? 20 : 0,
                }}>
                {selectedPlan === 'Monthly' ? (
                  // `  Starting from  ${
                  //   new Date(selectedMultipleDates.start)
                  //     .getDate()
                  //     .toString()
                  //     .padStart(2, '0') +
                  //   '-' +
                  //   (new Date(selectedMultipleDates.start).getMonth() + 1)
                  //     .toString()
                  //     .padStart(2, '0') +
                  //   '-' +
                  //   new Date(selectedMultipleDates.start).getFullYear()
                  // }`
                  <Text style={[styles.selectedPlanName]}>
                    {new Date(selectedMultipleDates.start)
                      .getDate()
                      .toString()
                      .padStart(2, '0') +
                      '-' +
                      (new Date(selectedMultipleDates.start).getMonth() + 1)
                        .toString()
                        .padStart(2, '0') +
                      '-' +
                      new Date(selectedMultipleDates.start).getFullYear()}
                    {' - '}
                    {new Date(selectedMultipleDates.end)
                      .getDate()
                      .toString()
                      .padStart(2, '0') +
                      '-' +
                      (new Date(selectedMultipleDates.end).getMonth() + 1)
                        .toString()
                        .padStart(2, '0') +
                      '-' +
                      new Date(selectedMultipleDates.end).getFullYear()}
                  </Text>
                ) : selectedPlan === 'Custom' ? (
                  ` Every ${selectedCustomDays
                    .filter(e => e.day)
                    .map(e => e.day?.l + `(${e.count})`)
                    .join(', ')} for ${numberOfWeeks} weeks`
                ) : selectedPlan === 'One Time' ? null : (
                  <Text style={[styles.selectedPlanName]}>
                    {new Date(selectedMultipleDates.start)
                      .getDate()
                      .toString()
                      .padStart(2, '0') +
                      '-' +
                      (new Date(selectedMultipleDates.start).getMonth() + 1)
                        .toString()
                        .padStart(2, '0') +
                      '-' +
                      new Date(selectedMultipleDates.start).getFullYear()}
                    {' - '}
                    {new Date(selectedMultipleDates.end)
                      .getDate()
                      .toString()
                      .padStart(2, '0') +
                      '-' +
                      (new Date(selectedMultipleDates.end).getMonth() + 1)
                        .toString()
                        .padStart(2, '0') +
                      '-' +
                      new Date(selectedMultipleDates.end).getFullYear()}
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            padding: 20,
            backgroundColor: 'white',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 19,
              color: '#000000',
              fontFamily: 'Montserrat-Bold',
            }}>
            Product Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Product Name
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                fontFamily: 'Montserrat-Medium',
                color: 'black',
              }}>
              {productInfo.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Quantity
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: 'black',
                padding: 5,

                fontFamily: 'Montserrat-Bold',
              }}>
              {selectedPlan === 'Monthly' ? (
                <Text>{productCount * (totalDays - 5)} + 5(free) = 30</Text>
              ) : (
                <Text>{productCount * totalDays}</Text>
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Unit
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: 'black',
                padding: 5,
                fontFamily: 'Montserrat-Bold',
              }}>
              <Text>{unit}</Text>
            </Text>
          </View>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 19,
              color: '#000000',
              fontFamily: 'Montserrat-Bold',
            }}>
            Bill Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Item Total
            </Text>
            {selectedPlan === 'Monthly' ? (
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000000',
                  fontFamily: 'Montserrat-Medium',
                }}>
                ₹{productCount * (totalDays - 5) * price}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000000',
                  fontFamily: 'Montserrat-Medium',
                }}>
                ₹{productCount * totalDays * price}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: '#000000',
                fontFamily: 'Montserrat-Medium',
              }}>
              Total
            </Text>
            {selectedPlan === 'Monthly' ? (
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000000',
                  fontFamily: 'Montserrat-Bold',
                }}>
                ₹{productCount * (totalDays - 5) * price}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000000',
                  fontFamily: 'Montserrat-Bold',
                }}>
                ₹{productCount * totalDays * price}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 19,
              color: '#000000',
              fontFamily: 'Montserrat-Bold',
            }}>
            Deliver To
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 19,
              marginTop: 10,
              marginLeft: 30,
              color: '#000000',
              fontFamily: 'Montserrat-Regular',
            }}>{`${user.address.door}, ${user.address.street}, ${user.address.area}`}</Text>
        </View>

        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
              <Text style={{fontSize: 16, lineHeight: 19, color: '#015fab'}}>
                Total
              </Text>
              {selectedPlan === 'Monthly' ? (
                <Text
                  style={{
                    fontSize: 30,
                    lineHeight: 35,
                    color: '#000000',
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  ₹{productCount * (totalDays - 5) * price}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 30,
                    lineHeight: 35,
                    color: '#000000',
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  ₹{productCount * totalDays * price}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={proceed}
              style={{
                flex: 1.5,
                backgroundColor: '#25b252',
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 1,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 24,
                  textTransform: 'uppercase',
                  textAlignVertical: 'center',
                  color: '#ffffff',
                  fontFamily: 'Montserrat-Bold',
                }}>
                Proceed To Pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

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
  checkoutContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

export default Checkout;
