import Modal from '../../../../../component/Modal';
import { Actions, InitialState, MODAL } from '../reducer';
import AvailabilityDetails from './AvailabilityContainer';

type Props = {
  state: InitialState;
  dispatch: React.Dispatch<Actions>;
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
        </div>
      </Modal>
    </div>
  );
};

export default CreateOrEditModal;
