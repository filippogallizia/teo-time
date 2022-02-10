import FixedBookingsManagerApi from '../FixedBookingsManagerApi';
import {
  Actions,
  ADD_OR_REMOVE_FIXED_BKS,
  DELETE,
  EDIT_EMAIL,
  EDIT_END_HOUR,
  EDIT_START_HOUR,
  FixedBookType,
  USER_IS_EDITING,
} from '../reducer';
import HourPicker from './HourPicker';

type BookDetailsType = {
  bks: FixedBookType;
  day: string;
  dispatch: React.Dispatch<Actions>;
};

const BookDetails = ({ bks, day, dispatch }: BookDetailsType) => {
  const handleIsUserEditing = (p: boolean) => {
    dispatch({
      type: USER_IS_EDITING,
      payload: true,
    });
  };

  //TODO style
  return (
    <div className={`grid grid-cols-3 gap-4 border-b-8pb-2`}>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <HourPicker
          value={bks.start}
          onChange={(e) => {
            dispatch({
              type: EDIT_START_HOUR,
              payload: {
                booking: {
                  day: day,
                  start: e.target.value,
                  key: bks.key,
                },
              },
            });
            handleIsUserEditing(true);
          }}
        />
        <HourPicker
          value={bks.end}
          onChange={(e) => {
            dispatch({
              type: EDIT_END_HOUR,
              payload: {
                booking: {
                  day: day,
                  end: e.target.value,
                  key: bks.key,
                },
              },
            });
            handleIsUserEditing(true);
          }}
        />
      </div>
      {/*<p className={`col-span-3 ${ITALIC}`}>
        {i18n.t('adminPage.avalManagerPage.workingTime')}
        cliente
      </p>*/}
      <div className="col-span-3 grid grid-cols-1 items-center">
        <p>Email</p>
        <input
          type="text"
          id="clientName"
          className="w-50 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.email}
          onChange={(e) => {
            dispatch({
              type: EDIT_EMAIL,
              payload: {
                booking: {
                  day: day,
                  key: bks.key,
                  email: e.target.value,
                },
              },
            });
            handleIsUserEditing(true);
          }}
        />
      </div>
      <div className="col-span-3 red-200">
        <button
          className="text-red-600"
          onClick={() => {
            //const isConfirmed = promptConfirmation();
            //if (!isConfirmed) return;
            //else {
            const deleteBooking = async () => {
              await FixedBookingsManagerApi.deleteFixedBooking(bks.key);
            };
            deleteBooking();
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  key: bks.key,
                  start: '',
                  end: '',
                  email: '',
                },
                type: DELETE,
              },
            });
            handleIsUserEditing(true);
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
