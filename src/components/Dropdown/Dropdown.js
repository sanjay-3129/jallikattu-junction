import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = props => {
  const {
    open,
    value,
    items,
    label,
    setOpen,
    setValue,
    loading,
    setItems,
    placeholder,
    zIndex,
  } = props;

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        loading={loading}
        setItems={setItems}
        mode="BADGE"
        style={{
          borderRadius: 5,
          backgroundColor: '#6f0b83',
          borderWidth: 1,
          height: 35,
          borderColor: '#e4a2e7',
        }}
        textStyle={{
          color: 'white',
          fontFamily: 'Montserrat-Bold',
          fontSize: 18,
          lineHeight: 22,
        }}
        dropDownContainerStyle={{borderWidth: 0, elevation: 10}}
        listItemLabelStyle={{fontFamily: 'Montserrat-Medium'}}
        listItemContainerStyle={{backgroundColor: '#6f0b83'}}
        listMode="SCROLLVIEW"
        zIndex={zIndex}
        showTickIcon={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  inputLabel: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    lineHeight: 22,
  },
});

export default Dropdown;
