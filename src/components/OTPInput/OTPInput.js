import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const OTPInput = props => {
  const {otp, setOtp, onSubmit} = props;
  const otpRef = useRef();

  useEffect(() => {
    otpRef?.current.focusField(0);
  }, []);

  return (
    <View>
      <OTPInputView
        style={{width: '100%', height: 100}}
        ref={otpRef}
        pinCount={6}
        autoFocusOnLoad={false}
        code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        onCodeChanged={code => {
          setOtp(code);
        }}
        codeInputFieldStyle={styles.inputStyleBase}
        codeInputHighlightStyle={styles.inputStyleHighLighted}
        onCodeFilled={code => {
          onSubmit(code);
        }}
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  inputStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  inputStyleBase: {
    width: 40,
    height: 50,
    backgroundColor: '#f3f3f3',
    borderRadius: 6,
    color: 'black',
    fontFamily: 'Montserrat-Bold',
  },
});
