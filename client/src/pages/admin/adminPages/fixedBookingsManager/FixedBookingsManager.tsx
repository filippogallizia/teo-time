import GeneralButton from '../../../../component/GeneralButton';
import { handleToastInFailRequest } from '../../../../helpers/utils';

import CardComponent from '../../components/Card';
import { useEffect, useReducer } from 'react';
import { Prompt } from 'react-router';

import reducer, {
  ADD,
  ADD_OR_REMOVE_FIXED_BKS,
  SET_FIXED_BKS,
  USER_IS_EDITING,
} from './reducer';
import { toast } from 'react-toastify';
import BookDetails from './components/BookDetails';
import FixedBookingsManagerApi from './FixedBookingsManagerApi';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const initialState = {
  fixedBks: [
    {
      day: 'Monday',
      bookings: [],
    },
    {
      day: 'Tuesday',
      bookings: [],
    },
    {
      day: 'Wednesday',
      bookings: [],
    },
    {
      day: 'Thursday',
      bookings: [],
    },
    {
      day: 'Friday',
      bookings: [],
    },
  ],
  userIsEditing: false,
};

const FixedBksManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const asyncFn = async () => {
      const handleSuccess = (res: any) => {
        dispatch({ type: SET_FIXED_BKS, payload: res });
      };
      const response = await FixedBookingsManagerApi.getFixedBookings();
      handleSuccess(response);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {}, []);

  return (
    <div className=" grid grid-cols-1 gap-8 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day: string) => {
          const matchedDay = state.fixedBks.find((d) => d.day === day);
          return (
            <div key={day} className="p-4">
              <CardComponent key={day}>
                <div className={`grid grid-cols-1 gap-4`}>
                  <div className="grid grid-cols-2 items-center">
                    <p>{day}</p>
                    <div className="justify-self-end">
                      <GeneralButton
                        buttonText="+"
                        onClick={() => {
                          dispatch({
                            type: ADD_OR_REMOVE_FIXED_BKS,
                            payload: {
                              day,
                              booking: {
                                key: Math.floor(
                                  100000 + Math.random() * 900000
                                ),
                                start: '',
                                end: '',
                                email: '',
                              },
                              type: ADD,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  {matchedDay &&
                    matchedDay.bookings.map((bks) => {
                      return (
                        <div key={bks.key}>
                          <BookDetails
                            dispatch={dispatch}
                            bks={bks}
                            day={matchedDay.day}
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

      <div className="flex w-full justify-center">
        <GeneralButton
          buttonText="Modifica disponibilita"
          onClick={() => {
            const asyncFn = async () => {
              try {
                await FixedBookingsManagerApi.createFixedBookings(
                  state.fixedBks
                );
                dispatch({
                  type: USER_IS_EDITING,
                  payload: false,
                });
                toast.success("Disponibilita' cambiate!");
              } catch (e: any) {
                handleToastInFailRequest(e, toast);
              }
            };
            asyncFn();
          }}
        />
      </div>
      <Prompt
        when={state.userIsEditing}
        message="You have unsaved changes, are you sure you want to leave?"
      />
    </div>
  );
};

export default FixedBksManager;
