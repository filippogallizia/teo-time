import GeneralButton from '../../../../../component/GeneralButton';
import Modal from '../../../../../component/Modal';
import { Actions, DayAvalSettingsType, InitialState, MODAL } from '../reducer';
import AvailabilityDetails from './AvailabilityContainer';
import AvailManagerApi from '../AvailabilitiesManagerApi';
import { toast } from 'react-toastify';
import { fetchAndSetSetState } from '../AvailabilitiesManager';
import ToastService from '../../../../../services/ToastService';

type Props = {
  state: InitialState;
  dispatch: React.Dispatch<Actions>;
};

const editAvail = async (day: DayAvalSettingsType) => {
  return await AvailManagerApi.createDefaultAvail(day);
};

const CreateOrEditModal = ({ state, dispatch }: Props) => {
  const closeModal = () => {
    dispatch({
      type: MODAL,
      payload: {
        modal: {
          isOpen: false,
        },
      },
    });
  };

  return (
    <div>
      <Modal
        onClick={() => {
          closeModal();
        }}
      >
        <div
          className="flex flex-col gap-6 p-8 justify-center items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <AvailabilityDetails
            state={state}
            dispatch={dispatch}
            day={state.selectedDay}
          />
          <div className="flex gap-4">
            <GeneralButton
              buttonText="Cancel"
              secondary={true}
              onClick={() => {
                closeModal();
              }}
            />
            <GeneralButton
              buttonText={'Save'}
              onClick={async () => {
                try {
                  await editAvail(state.selectedDay);
                  fetchAndSetSetState(dispatch);
                  toast.success(`edited successfully`);
                  closeModal();
                } catch (e) {
                  ToastService.error(e);
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateOrEditModal;
