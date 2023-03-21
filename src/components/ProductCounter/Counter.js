import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const Counter = ({setCount, count, removeOnMinus}) => {
  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    if (count > 1 || removeOnMinus) {
      setCount(count - 1);
    }
  };

  return (
    <View style={styles.counter}>
      <TouchableOpacity onPress={decrease}>
        <Text style={styles.minusIcon}>-</Text>
      </TouchableOpacity>
      <Text style={styles.count}>{count}</Text>
      <TouchableOpacity onPress={increase}>
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    borderColor: '#e4a2e7',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 35,
    marginTop: 20,
  },
  minusIcon: {
    backgroundColor: '#ffd688',
    borderRadius: 10,
    textAlign: 'center',
    height: 20,
    width: 20,
  },
  count: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
  },
  plusIcon: {
    backgroundColor: '#ffd688',
    borderRadius: 10,
    textAlign: 'center',
    height: 20,
    width: 20,
  },
});
