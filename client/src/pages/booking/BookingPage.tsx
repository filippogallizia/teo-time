import React from 'react';

import MobileBkgVersion from './components/mobileBkgVersion/MobileBkgVersion';
import DesktopBkgVersion from './components/desktopBkgVersion/DesktopBkgVersion';
import { useMediaQuery } from 'react-responsive';
import { device } from 'src/shared/styles/device';

function BookingPage() {
  const IS_MOBILE = useMediaQuery({ query: device.phone });

  return (
    <>
      {IS_MOBILE && <MobileBkgVersion />}

      {!IS_MOBILE && <DesktopBkgVersion />}
    </>
  );
}

export default BookingPage;
