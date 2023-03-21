import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Dropdown from '../../components/Dropdown/Dropdown';
import Counter from '../../components/ProductCounter/Counter';
import BigCounter from '../../components/ProductCounter/BigCounter';
import ChangePlanIcon from '../../assets/svg/changePlan.svg';
import ProceedButtonRightIcon from '../../assets/svg/proceedRightArrow.svg';
import {useSelector} from 'react-redux';
import Calender from '../../components/calender/Calender';

const Product = ({navigation, route}) => {
  const {params} = route;
  const [productInfo, setProductInfo] = useState({});
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [productCount, setProductCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState(0);

  const [selectedMultipleDates, setSelectedMultipleDates] = useState({});
  const [selectedCustomDays, setSelectedCustomDays] = useState([]);
  const [numberOfWeeks, setNumberOfWeeks] = useState('4');

  const {name = '', description = '', image = ''} = productInfo;

  const getProductDetails = async id => {
    const doc = await firestore().collection('products').doc(id).get();
    const product = doc.data();
    setProductInfo(product);
    let itemList = [];
    product?.prices.forEach(val => {
      itemList.push({
        label: val.unit,
        value: val.unit,
      });
    });
    setItems(itemList);
    setValue(itemList[0].value);
  };

  useEffect(() => {
    const product = params.productInfo;
    if (product) {
      // console.log(product.prices);
      setProductInfo(product);
      let itemList = [];
      product?.prices.forEach(val => {
        itemList.push({
          label: val.unit,
          value: val.unit,
        });
      });
      setItems(itemList);
      setValue(itemList[0].value);
    } else {
      console.log(params);
      getProductDetails(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (value !== '') {
      const prices = productInfo.prices;
      prices.forEach(val => {
        if (val.unit === value) {
          setPrice(val.price);
        }
      });
    }
  }, [value, productInfo.prices]);

  const [selectedPlan, setSelectedPlan] = useState('');
  const [customSelectionDone, setCUstomSelectionDone] = useState(false);
  const [calender, showCalender] = useState(false);

  const ProceedButton = () => {
    let totalDays = 1;

    if (selectedPlan === 'Alternative Days' || selectedPlan === 'Daily') {
      totalDays = moment(selectedMultipleDates.end).diff(
        selectedMultipleDates.start,
        'days',
      );
    } else if (selectedPlan === 'Monthly') {
      totalDays = 30;
    } else if (selectedPlan === 'Custom') {
      totalDays =
        selectedCustomDays.length > 0 &&
        selectedCustomDays.reduce((prev, curr) => ({
          count: prev.count + curr.count,
        })).count;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('checkout', {
            productInfo,
            selectedPlan,
            numberOfWeeks,
            selectedMultipleDates,
            selectedCustomDays,
            totalDays,
            productCount,
            price,
            unit: value,
          })
        }
        style={styles.proceedButton}>
        {selectedPlan === 'Monthly' ? (
          <Text style={styles.proceedButtonPrice}>
            ₹{productCount * (totalDays - 5) * price}
          </Text>
        ) : (
          <Text style={styles.proceedButtonPrice}>
            ₹{productCount * totalDays * price}
          </Text>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.proceedButtonText}>{'PROCEED'}</Text>
          <ProceedButtonRightIcon />
        </View>
      </TouchableOpacity>
    );
  };

  const OneTimePurchase = () => {
    return (
      <View style={styles.oneTimePurchase}>
        <BigCounter count={productCount} setCount={setProductCount} />
        <TouchableOpacity
          onPress={() => setSelectedPlan('')}
          style={styles.changePlan}>
          <ChangePlanIcon />
          <Text style={styles.changePlanText}>Change Plan</Text>
        </TouchableOpacity>
        <ProceedButton />
      </View>
    );
  };

  const SubscriptionPurchase = () => {
    return (
      <View style={styles.subscriptionPurchase}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setSelectedPlan('')}
            style={[styles.changePlan, {marginTop: 0}]}>
            <Text style={styles.changePlanText}>Plan</Text>
            <ChangePlanIcon />
          </TouchableOpacity>
          <Text style={styles.selectedPlanName}>{selectedPlan}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedMultipleDates({});
              showCalender(true);
            }}
            style={[styles.changePlan, {marginTop: 0}]}>
            <Text style={styles.changePlanText}>Date</Text>
            <ChangePlanIcon />
          </TouchableOpacity>
          {selectedPlan === 'Daily' && (
            <Text
              style={[
                styles.selectedPlanName,
                {fontFamily: 'Montserrat-Medium', fontSize: 15},
              ]}>
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

          {selectedPlan === 'Alternative Days' && (
            <Text
              style={[
                styles.selectedPlanName,
                {fontFamily: 'Montserrat-Medium', fontSize: 15},
              ]}>
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

          {selectedPlan === 'Monthly' && (
            // <Text
            //   style={[
            //     styles.selectedPlanName,
            //     {fontFamily: 'Montserrat-Medium', fontSize: 15},
            //   ]}>
            //   {' '}
            //   Starting from{' '}
            //   {new Date(selectedMultipleDates.start)
            //     .getDate()
            //     .toString()
            //     .padStart(2, '0') +
            //     '-' +
            //     (new Date(selectedMultipleDates.start).getMonth() + 1)
            //       .toString()
            //       .padStart(2, '0') +
            //     '-' +
            //     new Date(selectedMultipleDates.start).getFullYear()}
            // </Text>
            <Text
              style={[
                styles.selectedPlanName,
                {fontFamily: 'Montserrat-Medium', fontSize: 15},
              ]}>
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

          {selectedPlan === 'Custom' && (
            <Text
              style={[
                styles.selectedPlanName,
                {fontFamily: 'Montserrat-Medium', fontSize: 15},
              ]}>
              Every{' '}
              {selectedCustomDays
                .filter(e => e.day)
                .map(e => e.day?.l + `(${e.count})`)
                .join(', ')}{' '}
              for {numberOfWeeks} weeks
            </Text>
          )}
        </View>
        {selectedPlan !== 'Custom' && (
          <View style={{alignSelf: 'center', width: '30%'}}>
            <Counter setCount={setProductCount} count={productCount} />
          </View>
        )}
        <ProceedButton />
      </View>
    );
  };

  const CustomPurchase = () => {
    const days = [
      {s: 'SU', l: 'Sunday'},
      {s: 'M', l: 'Monday'},
      {s: 'TU', l: 'Tuesday'},
      {s: 'W', l: 'Wednesday'},
      {s: 'TH', l: 'Thursday'},
      {s: 'F', l: 'Friday'},
      {s: 'SA', l: 'Saturday'},
    ];

    return (
      <View style={styles.customPurchaseContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedPlan('');

              setSelectedCustomDays([]);
            }}
            style={styles.changePlan}>
            <ChangePlanIcon />
            <Text style={styles.changePlanText}>Change Plan</Text>
          </TouchableOpacity>
          <View
            style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <TextInput
              maxLength={2}
              keyboardType="number-pad"
              value={numberOfWeeks}
              onChangeText={v => setNumberOfWeeks(v)}
              style={{
                borderWidth: 1,
                padding: 0,
                borderColor: 'white',
                height: 40,
                textAlign: 'center',
                width: 40,
                color: 'white',
              }}
            />
            <Text style={[styles.infoText, {marginLeft: 10}]}>Weeks</Text>
          </View>
        </View>
        <View style={styles.customPurchaseWeekListContainer}>
          {days.map(day => (
            <TouchableOpacity
              onPress={() => {
                if (!selectedCustomDays.find(e => e.day?.l === day?.l)) {
                  setSelectedCustomDays([
                    ...selectedCustomDays,
                    {day, count: 1},
                  ]);
                } else {
                  const selectedCustomDaysCopy = selectedCustomDays.filter(
                    e => e.day?.l !== day?.l,
                  );
                  setSelectedCustomDays(selectedCustomDaysCopy);
                }
              }}
              key={day?.l}
              style={[
                styles.customPurchaseDayButton,
                {
                  backgroundColor: selectedCustomDays.find(
                    e => e.day?.s === day.s,
                  )
                    ? 'rgba(255, 214, 136, 1)'
                    : '#6f0b83',
                  elevation: selectedCustomDays.find(e => e.day?.s === day.s)
                    ? 10
                    : 0,
                },
              ]}>
              <Text
                style={[
                  styles.customPurchaseDayButtonText,
                  {
                    color: selectedCustomDays.find(e => e.day?.s === day.s)
                      ? '#6f0b83'
                      : 'white',
                  },
                ]}>
                {day.s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.customPurchaseSelectedDaysListContainer
            }>
            {selectedCustomDays
              .filter(e => e.day)
              .map(customDay => (
                <View
                  key={customDay?.day?.s}
                  style={styles.customPurchaseSelectedDay}>
                  <Text style={styles.customPurchaseSelectedDayText}>
                    {customDay.day?.l}
                  </Text>
                  <View style={{flex: 1}}>
                    <Counter
                      count={customDay.count}
                      removeOnMinus
                      setCount={count => {
                        if (count === 0) {
                          const selectedCustomDaysCopy = [
                            ...selectedCustomDays,
                          ];
                          const currentItems = selectedCustomDaysCopy.filter(
                            e => e.day?.s !== customDay.day?.s,
                          );
                          setSelectedCustomDays(currentItems);
                          return;
                        }
                        const selectedCustomDaysCopy = [...selectedCustomDays];
                        const currentItem = selectedCustomDaysCopy.find(
                          e => e.day?.s === customDay.day?.s,
                        );
                        currentItem.count = count;
                        setSelectedCustomDays(selectedCustomDaysCopy);
                      }}
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>

        {selectedCustomDays.length > 0 && (
          <View style={styles.bottomInfoAction}>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>Set day and count</Text>
            </View>
            <TouchableOpacity
              onPress={() => showCalender(true)}
              style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Set Period</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const selectPlan = (plan, calender) => {
    setSelectedPlan(plan);
    calender && showCalender(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <View style={styles.productImageContainer}>
        {image.length > 0 && (
          <Image style={{width: 250, height: 250}} source={{uri: image}} />
        )}
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{name}</Text>
        <View style={styles.priceDetailsContainer}>
          {!calender && (
            <View style={styles.unitContainer}>
              <Dropdown
                open={open}
                setOpen={setOpen}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                loading={loading}
                zIndex={10000}
                setLoading={setLoading}
              />
            </View>
          )}
          {/* <View style={styles.counterContainer}>
            {selectedPlan.length === 0 && (
              <Counter count={productCount} setCount={setProductCount} />
              // <Text style={styles.price}>1 product= </Text>
            )}
          </View> */}
          <View style={{flex: 1}}>
            {!calender && <Text style={styles.price}>₹{price}</Text>}
          </View>
        </View>
        {!calender && (
          <View>
            {descriptionExpanded ? (
              <Text style={styles.productDescription}>{description}</Text>
            ) : (
              <Text style={styles.productDescription}>
                {description.substr(0, 100)}...
              </Text>
            )}
            <Text
              onPress={() => setDescriptionExpanded(!descriptionExpanded)}
              style={styles.moreButton}>
              {descriptionExpanded ? 'Show Less' : 'More'}
            </Text>
          </View>
        )}

        {selectedPlan.length === 0 && !calender && (
          <View style={styles.planSheet}>
            <Text style={styles.planTitle}>Choose Your Plan</Text>
            <View style={styles.plansButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  // setSelectedMultipleDates({});
                  // selectPlan('Daily', true);
                  ToastAndroid.show(
                    'This will be enabled soon!!!',
                    ToastAndroid.LONG,
                  );
                }}
                style={styles.plansButton}>
                <Text style={styles.planButtonText}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setSelectedMultipleDates({});
                  // selectPlan('Alternative Days', true);
                  ToastAndroid.show(
                    'This will be enabled soon!!!',
                    ToastAndroid.LONG,
                  );
                }}
                style={styles.plansButton}>
                <Text style={styles.planButtonText}>Alternate Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedMultipleDates({});
                  selectPlan('Monthly', true);
                  // ToastAndroid.show(
                  //   'This will be enabled soon!!!',
                  //   ToastAndroid.LONG,
                  // );
                }}
                style={styles.plansButton}>
                <Text style={styles.planButtonText}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => selectPlan('One Time')}
                style={styles.plansButton}>
                <Text style={styles.planButtonText}>One Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setSelectedMultipleDates({});
                  // selectPlan('Custom');
                  ToastAndroid.show(
                    'This will be enabled soon!!!',
                    ToastAndroid.LONG,
                  );
                }}
                style={styles.plansButton}>
                <Text style={styles.planButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedPlan === 'One Time' && <OneTimePurchase />}
        {selectedPlan === 'Daily' && <SubscriptionPurchase />}
        {selectedPlan === 'Monthly' && <SubscriptionPurchase />}
        {selectedPlan === 'Alternative Days' && <SubscriptionPurchase />}
        {selectedPlan === 'Custom' && !calender && !customSelectionDone && (
          <CustomPurchase />
        )}
        {selectedPlan === 'Custom' && customSelectionDone && (
          <SubscriptionPurchase />
        )}
      </View>
      {calender && (
        <View style={styles.calenderContainer}>
          <Calender
            setSelectedMultipleDates={setSelectedMultipleDates}
            selectedMultipleDates={selectedMultipleDates}
            selectedPlan={selectedPlan}
            selectedCustomDays={selectedCustomDays}
            showCalender={showCalender}
            setCUstomSelectionDone={setCUstomSelectionDone}
            numberOfWeeks={numberOfWeeks}
          />
          <Text
            onPress={() => {
              setSelectedPlan('');
              showCalender(false);
            }}
            style={styles.selectedPlan}>
            {selectedPlan}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  productImageContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 30,
    // paddingTop: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 2,
    paddingTop: 25,
    backgroundColor: '#6f0b83',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  productName: {
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    marginHorizontal: 15,
  },
  priceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  unitContainer: {
    flex: 1.3,
  },
  counterContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  price: {
    flex: 1,
    fontSize: 25,
    lineHeight: 29,
    marginTop: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textAlign: 'right',
  },
  productDescription: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  planSheet: {
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#9d479f',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%',
  },
  planTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
  },
  plansButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  plansButton: {
    borderRadius: 7,
    backgroundColor: '#792eab',
    borderColor: '#e4a2e7',
    borderWidth: 1,
    padding: 10,
    width: 80,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  planButtonText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  oneTimePurchase: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#9d479f',
    flex: 1,
  },
  selectedPlan: {
    backgroundColor: '#c86dcb',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignSelf: 'center',
    top: '-10%',
    padding: 12,
    flex: 1,
    width: 200,
    fontSize: 12,
    position: 'absolute',
    lineHeight: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  subscriptionPurchase: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#9d479f',
    position: 'absolute',
    bottom: 0,
    height: '60%',
  },
  customPurchaseContainer: {
    backgroundColor: '#c86bdb',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 30,
  },
  customPurchaseWeekListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 25,
  },
  customPurchaseDayButton: {
    backgroundColor: '#6f0b83',
    borderRadius: 5,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customPurchaseDayButtonText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
  },
  customPurchaseSelectedDaysListContainer: {
    flexDirection: 'column',
    paddingHorizontal: 30,
    paddingBottom: '50%',
  },
  customPurchaseSelectedDay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customPurchaseSelectedDayText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    flex: 2,
    marginTop: 15,
  },
  bottomInfoAction: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 0,
    backgroundColor: '#c86dcb',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#ffd688',
    paddingVertical: 10,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 7,
  },
  doneButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#6f0b83',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  changePlan: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  changePlanText: {
    fontSize: 12,
    lineHeight: 15,
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    marginRight: 5,
    textAlign: 'center',
  },
  selectedPlanName: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    marginHorizontal: 30,
  },
  proceedButton: {
    backgroundColor: '#04bd00',
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  proceedButtonPrice: {
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
  },
  proceedButtonText: {
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    marginLeft: 50,
    marginRight: 10,
  },

  moreButton: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Montserrat-Medium',
    color: '#ffffff',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  calenderContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    elevation: 1,
    zIndex: 1000,
  },
});
