import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const BigCounter = ({setCount, count}) => {
  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    if (count > 1) {
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

export default BigCounter;

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    borderColor: '#e4a2e7',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 70,
    width: 170,
    marginTop: 20,
  },
  minusIcon: {
    backgroundColor: '#ffd688',
    textAlign: 'center',
    height: 40,
    borderRadius: 20,
    fontSize: 28,
    width: 40,
  },
  count: {
    fontSize: 40,
    lineHeight: 49,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
  },
  plusIcon: {
    backgroundColor: '#ffd688',
    textAlign: 'center',
    height: 40,
    borderRadius: 20,
    fontSize: 28,
    width: 40,
  },
});
