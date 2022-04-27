import React from 'react';
import AvalContainer from '../AvailabilitiesContainer';
import CalendarComponent from '../Caledar';
import EventInformations from '../EventInformations';

const DesktopBkgVersion = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-4">
          <EventInformations />
        </div>
        <div className="col-span-2">
          <div style={{ maxWidth: '600px' }}>
            <CalendarComponent />
          </div>
        </div>
        <div className="col-span-2">
          <AvalContainer />
        </div>
      </div>
    </div>
  );
};

export default DesktopBkgVersion;
