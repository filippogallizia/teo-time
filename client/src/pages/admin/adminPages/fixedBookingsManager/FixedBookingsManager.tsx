import GeneralButton from '../../../../component/GeneralButton';

import CardComponent from '../../components/Card';
import { useEffect, useReducer } from 'react';
import { AiFillEdit } from 'react-icons/ai';

import reducer, {
  Actions,
  CREATE,
  EDIT_BOOKING_DETAILS,
  FixedBksType,
  InitialState,
  MODAL,
  SET_FIXED_BKS,
} from './reducer';
import BookDetails from './components/BookDetails';
import FixedBookingsManagerApi from './FixedBookingsManagerApi';
import CreateOrEditModal from './components/CreateOrEditModal';
import ToastService from '../../../../services/ToastService';

const initialState: InitialState = {
  fixedBks: [],
  modal: {
    isOpen: false,
    mode: CREATE,
  },
  bookingDetails: {
    start: '',
    end: '',
    day: '',
    email: '',
    exceptionDate: undefined,
  },
};

// TODO -> add validation to avoid having booking with same hours.

export const fetchAndSetBks = async (dispatch: React.Dispatch<Actions>) => {
  const handleSuccess = (res: any) => {
    dispatch({ type: SET_FIXED_BKS, payload: res });
  };
  try {
    const response = await FixedBookingsManagerApi.getFixedBookings();
    handleSuccess(response);
  } catch (error) {
    ToastService.error(error);
  }
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
                  bookingDetails: {
                    start: '',
                    end: '',
                    day: '',
                    email: '',
                    exceptionDate: undefined,
                  },
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
          state.fixedBks.map((daySettings: FixedBksType, i) => {
            return (
              <div key={`${daySettings.day}ciao`}>
                <CardComponent>
                  <div className={`grid grid-cols-1 gap-4`}>
                    <div className="grid grid-cols-2 items-center">
                      <p>{daySettings.day}</p>
                    </div>
                    {daySettings.bookings.map((bks, i) => {
                      const isLastItem = i === daySettings.bookings.length - 1;

                      return (
                        <div>
                          <div
                            key={`${bks.id}${bks.email}${bks.start}${bks.end}`}
                            className=" py-2 flex justify-between"
                          >
                            <div className="flex flex-col gap-4">
                              <p>Appuntamento: {i + 1}</p>
                              <BookDetails
                                state={state}
                                disabled={true}
                                dispatch={dispatch}
                                bks={bks}
                              />
                            </div>
                            <div className="cursor-pointer">
                              <AiFillEdit
                                //buttonText="edit"
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
                          </div>
                          {!isLastItem && (
                            <hr className="border-2 border-yellow-500 mt-4" />
                          )}
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
    </div>
  );
};

export default FixedBksManager;
