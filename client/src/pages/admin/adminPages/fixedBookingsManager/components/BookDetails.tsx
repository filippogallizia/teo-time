import i18n from '../../../../../i18n';
import { ITALIC } from '../../../../../constants/constant';
import { promptConfirmation } from '../../../../../helpers/utils';
import {
  Actions,
  ADD_OR_REMOVE_FIXED_BKS,
  DELETE,
  FixedBookType,
  UPLOAD_EMAIL_CLIENT,
  UPLOAD_END_DATE,
  UPLOAD_START_DATE,
} from '../reducer';
import HourPicker from './HourPicker';
import { useState } from 'react';

type BookDetailsType = {
  bks: FixedBookType;
  day: string;
  dispatch: React.Dispatch<Actions>;
};

const BookDetails = ({ bks, day, dispatch }: BookDetailsType) => {
  const [prova, setProva] = useState('');
  return (
    <div className={`grid grid-cols-3 gap-4 border-b-4 pb-2`}>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <HourPicker value={prova} onChange={setProva} />
        <HourPicker value={prova} onChange={setProva} />
      </div>
      <p className={`col-span-3 ${ITALIC}`}>
        {/*{i18n.t('adminPage.avalManagerPage.workingTime')}
         */}
        cliente
      </p>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>{i18n.t('adminPage.avalManagerPage.start')}</p>
        <input
          type="time"
          id="workTimeRange.start"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.start}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  start: e.target.value,
                },
                type: UPLOAD_START_DATE,
              },
            });
          }}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>{i18n.t('adminPage.avalManagerPage.end')}</p>
        <input
          type="time"
          id="workTimeRange.end"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.end}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  end: e.target.value,
                },
                type: UPLOAD_END_DATE,
              },
            });
          }}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>Email cliente</p>
        <input
          type="text"
          id="clientName"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.email}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  email: e.target.value,
                },
                type: UPLOAD_EMAIL_CLIENT,
              },
            });
          }}
        />
      </div>
      <div className="col-span-3 red-200">
        <button
          className="text-red-600"
          onClick={() => {
            const isConfirmed = promptConfirmation();
            if (!isConfirmed) return;
            else {
              dispatch({
                type: ADD_OR_REMOVE_FIXED_BKS,
                payload: {
                  day: day,
                  booking: {
                    id: bks.id,
                    start: '',
                    end: '',
                    email: '',
                  },
                  type: DELETE,
                },
              });
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
