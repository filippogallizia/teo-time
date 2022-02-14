import AvailManagerApi from './AvailabilitiesManagerApi';
import CardComponent from '../../components/Card';
import { useEffect, useReducer } from 'react';
import { handleToastInFailRequest } from '../../../../helpers/utils';
import { toast } from 'react-toastify';
import reducer, { Actions, DayAvalSettingsType, SET_STATE } from './reducer';
import CreateOrEditModal from './components/CreateOrEditModal';
import AvailabilityDetails from './components/AvailabilityContainer';
import initialState from './initialState.json';
import React from 'react';

export const fetchAndSetSetState = async (
  dispatch: React.Dispatch<Actions>
) => {
  const handleSuccess = (response: DayAvalSettingsType[]) => {
    dispatch({ type: SET_STATE, payload: response });
  };
  try {
    const response = await AvailManagerApi.getDefaultAvail();
    handleSuccess(response);
  } catch (e) {
    handleToastInFailRequest(e, toast);
  }
};

const AvalManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAndSetSetState(dispatch);
  }, [dispatch]);

  return (
    <div className=" grid grid-cols-1 gap-8 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {state.weekAvalSettings.map((day) => {
          return (
            <CardComponent key={day}>
              <AvailabilityDetails
                disabled={true}
                day={day}
                state={state}
                dispatch={dispatch}
              />
            </CardComponent>
          );
        })}
      </div>
      <div>
        {state.modal.isOpen && (
          <CreateOrEditModal state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
};

export default AvalManager;
