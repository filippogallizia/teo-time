import GeneralButton from '../../../../component/GeneralButton';
import { handleToastInFailRequest } from '../../../../helpers/utils';

import CardComponent from '../../components/Card';
import { useEffect, useReducer } from 'react';
import { Prompt } from 'react-router';

import reducer, {
  Actions,
  CREATE,
  EDIT_BOOKING_DETAILS,
  FixedBksType,
  InitialState,
  MODAL,
  SET_FIXED_BKS,
} from './reducer';
import { toast } from 'react-toastify';
import BookDetails from './components/BookDetails';
import FixedBookingsManagerApi from './FixedBookingsManagerApi';
import CreateOrEditModal from './components/CreateOrEditModal';

const initialState: InitialState = {
  fixedBks: [],
  modal: {
    isOpen: false,
    mode: CREATE,
  },
  bookingDetails: { start: '', end: '', day: '', email: '' },
};

export const fetchAndSetBks = async (dispatch: React.Dispatch<Actions>) => {
  const handleSuccess = (res: any) => {
    res.length > 0 && dispatch({ type: SET_FIXED_BKS, payload: res });
  };
  const response = await FixedBookingsManagerApi.getFixedBookings();
  handleSuccess(response);
};

const FixedBksManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAndSetBks(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className=" grid grid-cols-1 gap-8 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="justify-self-end">
          <GeneralButton
            buttonText="+"
            onClick={() => {
              dispatch({
                type: EDIT_BOOKING_DETAILS,
                payload: {
                  bookingDetails: { start: '', end: '', day: '', email: '' },
                },
              });
              dispatch({
                type: MODAL,
                payload: {
                  modal: {
                    isOpen: true,
                    mode: 'CREATE',
                  },
                },
              });
            }}
          />
        </div>
        {state.fixedBks.length > 0 &&
          state.fixedBks.map((daySettings: FixedBksType) => {
            //TODO -> check this key if is unique
            return (
              <div key={daySettings.day} className="bg-gray-100">
                <CardComponent key={daySettings.day}>
                  <div className={`grid grid-cols-1 gap-4`}>
                    <div className="grid grid-cols-2 items-center">
                      <p>{daySettings.day}</p>
                    </div>
                    {daySettings.bookings.map((bks, i) => {
                      console.log(bks, 'bks');
                      return (
                        <div
                          key={bks.id}
                          className=" py-2 flex flex-col gap-4 b"
                        >
                          <p>Appuntamento: {i + 1}</p>
                          {/*<BookContainer
                            state={state}
                            dispatch={dispatch}
                            bks={bks}
                          />*/}
                          <BookDetails
                            state={state}
                            disabled={true}
                            dispatch={dispatch}
                            bks={bks}
                          />
                          <GeneralButton
                            buttonText="edit"
                            onClick={() => {
                              dispatch({
                                type: EDIT_BOOKING_DETAILS,
                                payload: {
                                  bookingDetails: bks,
                                },
                              });
                              dispatch({
                                type: MODAL,
                                payload: {
                                  modal: {
                                    isOpen: true,
                                    mode: 'EDIT',
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardComponent>
              </div>
            );
          })}
      </div>
      <div>
        {state.modal.isOpen && (
          <CreateOrEditModal dispatch={dispatch} state={state} />
        )}
      </div>
      {/*<Prompt
        when={state.userIsEditing}
        message="You have unsaved changes, are you sure you want to leave?"
      />*/}
    </div>
  );
};

export default FixedBksManager;
