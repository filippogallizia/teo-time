import {
  Actions,
  BookingDetailsType,
  EDIT_BOOKING_DETAILS,
  InitialState,
} from '../reducer';
import DayPicker from './DayPicker';
import HourPicker from './HourPicker';

type BookDetailsType = {
  bks: BookingDetailsType;
  dispatch: React.Dispatch<Actions>;
  state: InitialState;
  disabled?: boolean;
  setBookingDetails?: React.Dispatch<React.SetStateAction<BookingDetailsType>>;
};

const BookDetails = ({
  bks,
  setBookingDetails,
  disabled,
  state,
  dispatch,
}: BookDetailsType) => {
  return (
    <div className={`flex flex-col gap-4`}>
      <DayPicker
        disabled={disabled}
        value={bks.day}
        onChange={(e) => {
          dispatch({
            type: EDIT_BOOKING_DETAILS,
            payload: {
              bookingDetails: {
                ...state.bookingDetails,
                day: e.target.value,
              },
            },
          });
        }}
      />
      <div className="flex gap-4">
        <HourPicker
          disabled={disabled}
          type="start"
          value={bks.start}
          onChange={(e) => {
            dispatch({
              type: EDIT_BOOKING_DETAILS,
              payload: {
                bookingDetails: {
                  ...state.bookingDetails,
                  start: e.target.value,
                },
              },
            });
          }}
        />
        <HourPicker
          disabled={disabled}
          type="end"
          value={bks.end}
          onChange={(e) => {
            dispatch({
              type: EDIT_BOOKING_DETAILS,
              payload: {
                bookingDetails: {
                  ...state.bookingDetails,
                  end: e.target.value,
                },
              },
            });
          }}
        />
      </div>
      <div>
        <input
          disabled={disabled}
          placeholder="email client"
          type="text"
          id="clientName"
          className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.email}
          onChange={(e) => {
            dispatch({
              type: EDIT_BOOKING_DETAILS,
              payload: {
                bookingDetails: {
                  ...state.bookingDetails,
                  email: e.target.value,
                },
              },
            });
          }}
        />
      </div>
    </div>
  );
};

export default BookDetails;
