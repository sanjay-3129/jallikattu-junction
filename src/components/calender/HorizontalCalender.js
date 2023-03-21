import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
const {datesGenerator} = require('dates-generator');
import moment from 'moment';
import LeftArrow from '../../assets/svg/leftarrow.svg';
import RightArrow from '../../assets/svg/rightarrow.svg';

const months = [
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
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const HorizontalCalender = ({
  selectedMultipleDates,
  selectedPlan,
  getOrders,
  selectedDate: selectedCalenderDate,
  setSelectedDate: setSelectedCalenderDate,
}) => {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [calendar, setCalendar] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const scrollviewRef = useRef();

  useEffect(() => {
    const body = {
      month: calendar.month,
      year: calendar.year,
    };
    const {dates, nextMonth, nextYear, previousMonth, previousYear} =
      datesGenerator(body);
    setDates([...dates]);
    setCalendar({
      ...calendar,
      nextMonth,
      nextYear,
      previousMonth,
      previousYear,
    });
  }, []);

  useEffect(() => {
    scrollviewRef.current.scrollTo({x: 1600, y: 0, animated: true});
  }, []);

  const onClickNext = () => {
    const body = {month: calendar.nextMonth, year: calendar.nextYear};
    const {dates, nextMonth, nextYear, previousMonth, previousYear} =
      datesGenerator(body);

    setDates([...dates]);
    setCalendar({
      ...calendar,
      month: calendar.nextMonth,
      year: calendar.nextYear,
      nextMonth,
      nextYear,
      previousMonth,
      previousYear,
    });
  };

  const onClickPrevious = () => {
    const body = {month: calendar.previousMonth, year: calendar.previousYear};
    const {dates, nextMonth, nextYear, previousMonth, previousYear} =
      datesGenerator(body);

    setDates([...dates]);
    setCalendar({
      ...calendar,
      month: calendar.previousMonth,
      year: calendar.previousYear,
      nextMonth,
      nextYear,
      previousMonth,
      previousYear,
    });
  };

  const isSelectedState = date => {
    // const startingDate =
    //   selectedMultipleDates.start &&
    //   moment(date).isSameOrAfter(selectedMultipleDates.start);

    // const evenDate =
    //   selectedMultipleDates.start &&
    //   moment(selectedMultipleDates.start).diff(date, 'days') % 2 === 0;

    return false;
  };

  return (
    <View
      style={{
        padding: 10,
        alignItems: 'center',
      }}>
      <View style={{width: 300}}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={onClickPrevious}>
            <LeftArrow />
          </TouchableOpacity>
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 15,
              lineHeight: 18,
              color: 'white',
              fontFamily: 'Montserrat-Bold',
            }}>
            {months[calendar.month]} {calendar.year}
          </Text>
          <TouchableOpacity onPress={onClickNext} style={{textAlign: 'right'}}>
            <RightArrow />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollviewRef}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row'}}>
            {dates.length > 0 &&
              dates.map(week => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    key={JSON.stringify(week[0])}>
                    <ScrollView
                      contentContainerStyle={{
                        flexDirection: 'row',
                        marginVertical: 20,
                      }}>
                      {week.map(each => {
                        return (
                          <TouchableOpacity
                            key={JSON.stringify(each)}
                            onPress={() => {
                              getOrders(each.jsDate);
                              setSelectedCalenderDate(each.jsDate);
                            }}
                            style={{
                              padding: 5,
                              borderWidth: 1,
                              borderColor: moment(each.jsDate).isSame(
                                new Date().setHours(0, 0, 0, 0),
                              )
                                ? 'orange'
                                : '#d86fdd',
                              borderRadius: 7,
                              marginHorizontal: 5,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlignVertical: 'center',
                                height: 30,
                                paddingVertical: 5,
                                fontSize: 12.8,
                                lineHeight: 16,
                                color: moment(each.jsDate).isSame(
                                  selectedCalenderDate,
                                )
                                  ? 'orange'
                                  : 'white',
                                fontFamily: 'Montserrat-Bold',
                              }}>
                              {each.date.toString().padStart(2, '0')}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HorizontalCalender;
