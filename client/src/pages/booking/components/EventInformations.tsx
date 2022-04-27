import React from 'react';
import { BsFillArrowLeftSquareFill as GoBackArrow } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { GrLocationPin } from 'react-icons/gr';
import { BiEuro } from 'react-icons/bi';
import { EVENT_INFO_TEXT, TITLE } from '../../../constants/constant';
import i18n from '../../../i18n';
import { BookingPhase } from './mobileBkgVersion/MobileBkgVersion';

type Props = {
  setBookingPhase?: React.Dispatch<React.SetStateAction<BookingPhase>>;
  bookingPhase?: BookingPhase;
};

const EventInformations = ({ bookingPhase, setBookingPhase }: Props) => {
  console.log(bookingPhase, 'bookingPhase');

  const SHOW_GO_BACK_ARROW =
    bookingPhase !== BookingPhase.VIEW_CALENDAR && bookingPhase;

  return (
    <div className={`grid col-1 gap-4 justify-items-center md:static`}>
      {SHOW_GO_BACK_ARROW && (
        <div
          className={`justify-self-start cursor-pointer md:static md:hidden`}
        >
          <GoBackArrow
            onClick={() => {
              setBookingPhase && setBookingPhase(BookingPhase.VIEW_CALENDAR);
            }}
            size="1.5em"
            color="#f59e0b"
          />
        </div>
      )}
      <div className="grid col-1 gap-4 justify-items-center">
        <p className={`${TITLE} text-center`}>
          {i18n.t('eventInformationComponent.eventType', {
            catergory: 'Trattamento osteopatico',
          })}
        </p>

        <div className={`flex items-center`}>
          <BiTime size="1em" color="black" />
          <p className={EVENT_INFO_TEXT}>
            {i18n.t('eventInformationComponent.eventTime', { duration: '1h' })}
          </p>
        </div>
        <div className="flex items-center">
          <GrLocationPin size="1em" color="black" />
          <div>
            <p className={EVENT_INFO_TEXT}>
              {i18n.t('eventInformationComponent.eventLocation', {
                location: 'Milano - via Osti',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <BiEuro size="1em" color="black" />
          <div>
            <p className={EVENT_INFO_TEXT}>50</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInformations;
