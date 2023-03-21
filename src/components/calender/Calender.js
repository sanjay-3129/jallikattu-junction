import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
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

const Calender = ({
  setSelectedMultipleDates,
  selectedMultipleDates,
  selectedCustomDays,
  selectedPlan,
  numberOfWeeks,
  showCalender,
  setCUstomSelectionDone,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [calendar, setCalendar] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const [isTommorowDisabled, setIsTommorowDisabled] = useState({
    status: false,
    date: null,
  });

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
    // check today, whether time is before 8pm and start date
    const date = new Date();
    if (date.getHours() < 20) {
      setIsTommorowDisabled({status: false, date: date});
    } else {
      ToastAndroid.show(
        'Time is above 8pm, so cant pick tommorrow',
        ToastAndroid.SHORT,
      );
      date.setDate(date.getDate() + 1);
      setIsTommorowDisabled({status: true, date: date});
    }
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

  const dailyPlansSelectedDate = date => {
    const startingDate =
      selectedMultipleDates.start &&
      moment(date).isSame(selectedMultipleDates.start);
    const endingDate =
      selectedMultipleDates.end &&
      moment(date).isSame(selectedMultipleDates.end);

    let datesBetweenStartingDateAndEndingDate = false;

    if (selectedMultipleDates.start && selectedMultipleDates.end) {
      datesBetweenStartingDateAndEndingDate = moment(date).isBetween(
        selectedMultipleDates.start,
        selectedMultipleDates.end,
      );
    }
    return startingDate || endingDate || datesBetweenStartingDateAndEndingDate;
  };

  const alternativePlansSelectedDate = date => {
    const startingDate =
      selectedMultipleDates.start &&
      moment(date).isSame(selectedMultipleDates.start);

    const endingDate =
      selectedMultipleDates.end &&
      moment(date).isSame(selectedMultipleDates.end);

    let evenDatesBetweenStartingDateAndEndingDate = false;

    if (selectedMultipleDates.start && selectedMultipleDates.end) {
      evenDatesBetweenStartingDateAndEndingDate =
        moment(date).isBetween(
          selectedMultipleDates.start,
          selectedMultipleDates.end,
        ) && moment(selectedMultipleDates.start).diff(date, 'days') % 2 === 0;
    }

    return (
      startingDate || endingDate || evenDatesBetweenStartingDateAndEndingDate
    );
  };
  // let i = 0;
  const monthlyPlansSelectedDate = date => {
    // console.log('date', date);
    const startingDate =
      selectedMultipleDates.start &&
      moment(date).isSame(selectedMultipleDates.start);

    moment.addRealMonth = function addRealMonth() {
      var fm = moment(selectedMultipleDates.start).add(30, 'days');
      // console.log('fm', fm);
      var fmEnd = moment(fm).endOf('month');
      // console.log('fmEnd', fmEnd);
      const valueReturned =
        date != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm : fm;
      return valueReturned;
      // return date != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD'))
      //   ? fm.add(1, 'd')
      //   : fm;
    };

    var nextMonth =
      selectedMultipleDates.start && moment.addRealMonth(moment());

    const endingDate = moment(date).isBetween(
      selectedMultipleDates.start,
      nextMonth,
    );
    // console.log('endingDate', endingDate, i++);

    return startingDate || endingDate;
    // return startingDate;
  };

  const customSelectedDays = date => {
    const daysNames = selectedCustomDays.map(custom => custom.day?.l);

    moment.addRealMonth = function addRealMonth() {
      var fm = moment(new Date()).add(numberOfWeeks * 7, 'days');
      var fmEnd = moment(fm).endOf('month');
      return new Date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD'))
        ? fm.add(1, 'd')
        : fm;
    };

    var lastWeekDate = moment.addRealMonth(moment());

    return (
      daysNames.includes(moment(date).format('dddd')) &&
      moment(date).isAfter(new Date()) &&
      moment(date).isBefore(lastWeekDate)
    );
  };

  const isSelectedState = date => {
    if (selectedPlan === 'Daily') {
      return dailyPlansSelectedDate(date);
    }
    if (selectedPlan === 'Alternative Days') {
      return alternativePlansSelectedDate(date);
    }
    if (selectedPlan === 'Monthly') {
      return monthlyPlansSelectedDate(date);
    }
    if (selectedPlan === 'Custom') {
      return customSelectedDays(date);
    }
  };

  const highLightAlternativedays = date => {
    if (selectedPlan === 'Alternative Days') {
      return (
        selectedMultipleDates.start &&
        moment(selectedMultipleDates.start).diff(date, 'days') % 2 !== 0 &&
        moment(date).isAfter(new Date())
      );
    }
  };

  const selectedDateForDailyPlans = date => {
    if (selectedMultipleDates.start === date.jsDate) {
      setSelectedMultipleDates({});
    } else if (!selectedMultipleDates.start) {
      setSelectedMultipleDates({
        start: date.jsDate,
      });
    } else if (!selectedMultipleDates.end) {
      const dateLDifference = moment(date.jsDate).diff(
        selectedMultipleDates.start,
        'days',
      );

      if (dateLDifference >= 6) {
        setSelectedMultipleDates({
          ...selectedMultipleDates,
          end: date.jsDate,
        });
      } else {
        ToastAndroid.show('Please select at least 7 days', ToastAndroid.SHORT);
      }
    } else if (selectedMultipleDates.start && selectedMultipleDates.end) {
      const dateLDifference = moment(date.jsDate).diff(
        selectedMultipleDates.start,
        'days',
      );

      if (dateLDifference >= 6) {
        setSelectedMultipleDates({
          ...selectedMultipleDates,
          end: date.jsDate,
        });
      }
    }
  };

  const selectedDateForAlternativePlans = date => {
    if (selectedMultipleDates.start === date.jsDate) {
      setSelectedMultipleDates({});
    } else if (!selectedMultipleDates.start) {
      setSelectedMultipleDates({
        start: date.jsDate,
      });
    } else if (!selectedMultipleDates.end) {
      const dateLDifference = moment(date.jsDate).diff(
        selectedMultipleDates.start,
        'days',
      );
      if (
        moment(date.jsDate).diff(selectedMultipleDates.start, 'days') % 2 ===
          0 &&
        dateLDifference >= 14
      ) {
        setSelectedMultipleDates({
          ...selectedMultipleDates,
          end: date.jsDate,
        });
      } else {
        ToastAndroid.show(
          'Please select at least 2 weeks(alternative days) for alternative subscription',
          ToastAndroid.SHORT,
        );
      }
    } else if (selectedMultipleDates.start && selectedMultipleDates.end) {
      const dateLDifference = moment(date.jsDate).diff(
        selectedMultipleDates.start,
        'days',
      );

      if (
        moment(date.jsDate).diff(selectedMultipleDates.start, 'days') % 2 ===
          0 &&
        dateLDifference >= 14
      ) {
        setSelectedMultipleDates({
          ...selectedMultipleDates,
          end: date.jsDate,
        });
      }
    }
  };

  const selectedDateForMonthlyPlans = date => {
    console.log('dateMonth', date);
    var fm = moment(date).add(29, 'days');
    console.log('dateMonthFm', new Date(fm).getDate());
    setSelectedMultipleDates({
      start: date.jsDate,
      end: fm.toDate(),
    });
  };

  const onSelectDate = date => {
    // console.log('date', date);
    setSelectedDate(new Date(date.year, date.month, date.date));
    if (selectedPlan === 'Daily') {
      selectedDateForDailyPlans(date);
      return;
    }
    if (selectedPlan === 'Alternative Days') {
      selectedDateForAlternativePlans(date);
      return;
    }
    if (selectedPlan === 'Monthly') {
      selectedDateForMonthlyPlans(date);
      return;
    }
  };

  const onDone = () => {
    if (selectedPlan === 'Daily') {
      if (!selectedMultipleDates.start || !selectedMultipleDates.end) {
        ToastAndroid.show(
          'Please Select Starting Date and Ending Date for Daily Plan',
          ToastAndroid.SHORT,
        );
        return;
      }
      showCalender(false);
      return;
    }
    if (selectedPlan === 'Alternative Days') {
      if (!selectedMultipleDates.start || !selectedMultipleDates.end) {
        ToastAndroid.show(
          'Please Select a Starting date and Ending Date for Alternative Subscription Plan',
          ToastAndroid.SHORT,
        );
        return;
      }
      showCalender(false);
      return;
    }
    if (selectedPlan === 'Monthly') {
      if (!selectedMultipleDates.start) {
        ToastAndroid.show(
          'Please Select a Starting date for monthly subscription',
          ToastAndroid.SHORT,
        );
        return;
      }
      showCalender(false);
      return;
    }
    setCUstomSelectionDone(true);
    showCalender(false);
  };

  return (
    <View
      style={{
        width: '100%',
        padding: 10,
        alignItems: 'center',
        borderTopEndRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#C86DCB',
      }}>
      <View style={{width: 300}}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={{padding: 10}} onPress={onClickPrevious}>
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
          <TouchableOpacity
            onPress={onClickNext}
            style={{textAlign: 'right', padding: 10}}>
            <RightArrow />
          </TouchableOpacity>
        </View>
        <View>
          <View>
            <View style={{width: '100%'}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {days.map((day, i) => (
                    <View key={day + '' + i} style={{paddingVertical: 5}}>
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
                          color: 'white',
                          fontFamily: 'Montserrat-Bold',
                        }}>
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                {dates.length > 0 &&
                  dates.map(week => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      key={JSON.stringify(week[0])}>
                      {week.map(each => {
                        return (
                          <TouchableOpacity
                            key={JSON.stringify(each)}
                            disabled={
                              selectedPlan === 'Custom' ||
                              moment(each.jsDate).isBefore(
                                isTommorowDisabled.date,
                              )
                            }
                            onPress={() => onSelectDate(each)}
                            style={{paddingVertical: 5}}>
                            <Text
                              style={{
                                textAlign: 'center',
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlignVertical: 'center',
                                height: 30,
                                paddingVertical: 5,
                                fontSize: 10,
                                lineHeight: 12,
                                color: highLightAlternativedays(each.jsDate)
                                  ? '#cccccc'
                                  : isSelectedState(each.jsDate)
                                  ? '#6f0b83'
                                  : moment(each.jsDate).isBefore(new Date())
                                  ? '#cccccc'
                                  : 'white',
                                borderRadius: 7,
                                elevation: isSelectedState(each.jsDate)
                                  ? 15
                                  : 0,
                                backgroundColor: highLightAlternativedays(
                                  each.jsDate,
                                )
                                  ? '#00000022'
                                  : moment(each.jsDate).isBefore(new Date())
                                  ? '#00000000'
                                  : isSelectedState(each.jsDate)
                                  ? '#FFD688'
                                  : calendar.month === each.month
                                  ? 'rgba(145, 54, 148, 1)'
                                  : '#00000000',
                                fontFamily: 'Montserrat-Bold',
                              }}>
                              {each.date.toString().padStart(2, '0')}
                              {/* {console.log(
                                each.date.toString().padStart(2, '0') ===
                                  isTommorowDisabled.date,
                                isTommorowDisabled.date,
                                each.date.toString().padStart(2, '0'),
                              )} */}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
              </View>
              <View
                style={[
                  styles.infoTextContainer,
                  {
                    justifyContent:
                      selectedPlan === 'Alternative Days' ||
                      selectedPlan === 'Custom'
                        ? 'center'
                        : 'space-between',
                  },
                ]}>
                {selectedPlan === 'Monthly' ? (
                  <Text style={styles.infoText}>Set Start Date</Text>
                ) : selectedPlan === 'Custom' ? (
                  <Text style={styles.infoText}>Custom days are selected</Text>
                ) : (
                  <Text style={styles.infoText}>
                    Set Start Date and End Date
                  </Text>
                )}
                {selectedPlan === 'Daily' && (
                  <Text style={styles.infoText}>Select Min. 7 Days</Text>
                )}
              </View>
              <TouchableOpacity onPress={onDone} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Calender;

const styles = StyleSheet.create({
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
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
});
