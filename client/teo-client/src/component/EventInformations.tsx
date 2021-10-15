import React from 'react';
import {
  BORDERS_GRAY,
  FLEX_DIR_COL,
  GLOBAL_PADDING,
  MARGIN_BOTTOM,
  MY_DIVIDER,
} from '../constant';

const EventInformations = () => {
  return (
    <div className={`${GLOBAL_PADDING} ${MY_DIVIDER} `}>
      <div className={`${FLEX_DIR_COL}`}>
        <p className={`${MARGIN_BOTTOM}`}>Matteo</p>
        <p>TRAINING</p>
      </div>
      <div>
        <p className={`${MARGIN_BOTTOM}`}>1h</p>
        <p>Milano</p>
      </div>
    </div>
  );
};

export default EventInformations;
