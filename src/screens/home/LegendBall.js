import React from 'react';
import Svg, {Circle} from 'react-native-svg';

const LegendBall = ({color}) => {
  return (
    <Svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="4.5" cy="4.5" r="4.5" fill={color} />
    </Svg>
  );
};

export default LegendBall;
