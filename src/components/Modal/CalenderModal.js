import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
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

const CalenderModal = props => {
  const {close, show, selectedDates, setSelectedDates, setAddedVacations} =
    props;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [calendar, setCalendar] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
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

  const modalConfig = {
    isVisible: show,
    coverScreen: true,
    animationIn: 'fadeInLeft',
    animationOut: 'fadeOutLeft',
    backdropOpacity: 0,
    style: {margin: 0},
    onBackButtonPress: () => {
      close(false);
    },
    onBackdropPress: () => {
      close(false);
    },
  };

  const isSelectedState = date => {
    const startingDate =
      selectedDates.start && moment(date).isSame(selectedDates.start);
    const endingDate =
      selectedDates.end && moment(date).isSame(selectedDates.end);

    let datesBetweenStartingDateAndEndingDate = false;

    if (selectedDates.start && selectedDates.end) {
      datesBetweenStartingDateAndEndingDate = moment(date).isBetween(
        selectedDates.start,
        selectedDates.end,
      );
    }
    return startingDate || endingDate || datesBetweenStartingDateAndEndingDate;
  };

  const onSelectDate = date => {
    setSelectedDate(new Date(date.year, date.month, date.date));
    if (!selectedDates.start) {
      setSelectedDates({
        start: date.jsDate,
      });
    } else if (!selectedDates.end) {
      const dateLDifference = moment(date.jsDate).diff(
        selectedDates.start,
        'days',
      );
      if (dateLDifference > 0) {
        setSelectedDates({
          ...selectedDates,
          end: date.jsDate,
        });
      } else {
        ToastAndroid.show('Please select a future date', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View>
      <Modal {...modalConfig}>
        <View style={styles.modal}>
          <View
            style={{
              width: '100%',
              padding: 10,
              alignItems: 'center',
              borderTopEndRadius: 30,
              borderTopLeftRadius: 30,
              backgroundColor: '#C86DCB',
            }}>
            <View style={{width: '100%'}}>
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
                <TouchableOpacity
                  onPress={onClickNext}
                  style={{textAlign: 'right'}}>
                  <RightArrow />
                </TouchableOpacity>
              </View>
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
                              disabled={moment(each.jsDate).isBefore(
                                new Date(),
                              )}
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
                                  color: isSelectedState(each.jsDate)
                                    ? '#6f0b83'
                                    : 'white',
                                  borderRadius: 7,
                                  elevation: isSelectedState(each.jsDate)
                                    ? 15
                                    : 0,
                                  backgroundColor: isSelectedState(each.jsDate)
                                    ? '#FFD688'
                                    : calendar.month === each.month
                                    ? 'rgba(145, 54, 148, 1)'
                                    : '#00000000',
                                  fontFamily: 'Montserrat-Bold',
                                }}>
                                {each.date.toString().padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                </View>
                <View style={[styles.infoTextContainer]}>
                  <Text style={styles.infoText}>
                    ● Set start date and end date
                  </Text>
                  <Text style={styles.infoText}>● Or set a specific date</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => {
                    close(false);
                    setSelectedDates({});
                  }}
                  style={styles.cancelButton}>
                  <Text style={styles.buttonText}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    close(false);
                    setAddedVacations(selectedDates);
                  }}
                  style={styles.okButton}>
                  <Text style={styles.buttonText}>ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalenderModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#c86ddb',
    marginVertical: '50%',
    marginHorizontal: '3%',
  },
  calenderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  monthText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 30,
  },
  weekName: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  infoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    marginTop: 20,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e58ce8',
  },
  okButton: {
    flex: 1,
    backgroundColor: '#6f0b83',
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Medium',
    color: '#ffffff',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
