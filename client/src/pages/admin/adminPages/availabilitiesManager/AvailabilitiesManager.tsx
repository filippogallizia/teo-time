import { BOLD, ITALIC } from '../../../../constants/constant';
import GeneralButton from '../../../../component/GeneralButton';
import AvailManagerApi from './AvailabilitiesManagerApi';
import CardComponent from '../../components/Card';
import { useEffect, useReducer } from 'react';
import { handleToastInFailRequest } from '../../../../helpers/utils';
import { toast } from 'react-toastify';
import reducer, { DayAvalSettingsType, SET_STATE } from './reducer';
import CreateOrEditModal from './components/CreateOrEditModal';
import AvailabilityDetails from './components/AvailabilityContainer';
import initialState from './initialState.json';

const AvalManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleSuccess = (response: DayAvalSettingsType[]) => {
      dispatch({ type: SET_STATE, payload: response });
    };

    const asyncFn = async () => {
      const response = await AvailManagerApi.getDefaultAvail();
      handleSuccess(response);
    };
    asyncFn();

    //getDefaultAvail(handleSuccess);
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
      <div className="flex w-full justify-center">
        <GeneralButton
          buttonText="Modifica disponibilita"
          onClick={() => {
            const asyncFn = async () => {
              try {
                await AvailManagerApi.createDefaultAvail(
                  state.weekAvalSettings
                );
                toast.success("Disponibilita' cambiate!");
              } catch (e: any) {
                handleToastInFailRequest(e, toast);
              }
            };
            asyncFn();
          }}
        />
      </div>
    </div>
  );
};

export default AvalManager;
