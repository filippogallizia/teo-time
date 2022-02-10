import Modal from '../../../../../component/Modal';
import { Actions, BookingDetailsType, MODAL } from '../reducer';
import BookDetails from './BookDetails';
import { InitialState } from '../reducer';
import FixedBookingsManagerApi from '../FixedBookingsManagerApi';
import GeneralButton from '../../../../../component/GeneralButton';
import { SUB_TITLE, TITLE } from '../../../../../constants/constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  handleToastInFailRequest,
  promptConfirmation,
} from '../../../../../helpers/utils';
import { fetchAndSetBks } from '../FixedBookingsManager';

type Props = {
  state: InitialState;
  dispatch: React.Dispatch<Actions>;
};

const CreateOrEditModal = ({ state, dispatch }: Props) => {
  const isCreateOrEdit = state.modal.mode;
  const is_create = isCreateOrEdit === 'CREATE';

  const deleteBooking = async (id: number) => {
    return await FixedBookingsManagerApi.deleteFixedBooking(id);
  };

  const closeModal = () => {
    dispatch({
      type: MODAL,
      payload: {
        modal: {
          isOpen: false,
          mode: state.modal.mode,
        },
      },
    });
  };

  const createOrEditBooking = async (
    isCreate: boolean,
    body: BookingDetailsType
  ) => {
    if (isCreate) {
      return await FixedBookingsManagerApi.createFixedBookings(body);
    } else {
      return await FixedBookingsManagerApi.updateFixedBookings(body);
    }
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
          <div>
            <p className={SUB_TITLE}>{isCreateOrEdit}</p>
          </div>
          <div>
            <BookDetails
              state={state}
              dispatch={dispatch}
              bks={state.bookingDetails}
            />
          </div>
          <div className="flex gap-4">
            <GeneralButton
              buttonText="Cancel"
              secondary={true}
              onClick={() => {
                closeModal();
              }}
            />
            <GeneralButton
              buttonText={is_create ? 'Create' : 'Save'}
              onClick={async () => {
                try {
                  await createOrEditBooking(is_create, state.bookingDetails);
                  fetchAndSetBks(dispatch);
                  toast.success(`${isCreateOrEdit} successfully`);
                  closeModal();
                } catch (e) {
                  handleToastInFailRequest(e, toast);
                }
              }}
            />
            {state.bookingDetails.id && (
              <GeneralButton
                buttonText={'Delete'}
                error={true}
                onClick={async () => {
                  try {
                    const isConfirmed = promptConfirmation();
                    if (!isConfirmed) return;
                    else {
                      if (state.bookingDetails.id) {
                        await deleteBooking(state.bookingDetails.id);
                        toast.success(`Deleted successfully`);
                        fetchAndSetBks(dispatch);
                        closeModal();
                      }
                    }
                  } catch (e) {
                    handleToastInFailRequest(e, toast);
                  }
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateOrEditModal;
