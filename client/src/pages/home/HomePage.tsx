import { Draft } from 'immer';
import React, { useEffect, useState } from 'react';
import { initialState } from 'src/component/authContext/AuthContext';
import { PayloadAction, useTable } from 'src/shared/hooks/useTable/useTable';
import foto_profilo from '../../shared/images/foto_profilo.jpeg';

const reducer = (draft: Draft<{ list: Array<any> }>, action: any) => {
  switch (action.type) {
    case 'SET_LIST':
      draft.list = action.payload.list;
      break;
  }
};

export type OutputPagination = {
  pageSize: number;
  pageNumber: number;
  hasNextPage: boolean;
  totalItems?: number;
};

type Action = PayloadAction<
  'SET_LIST',
  {
    list: Array<any>;
    pagination: OutputPagination;
  }
>;

const TableTril = () => {
  const [trigger, setTrigger] = useState(false);
  const { list, changePage, dispatch, pagination } = useTable<
    { list: Array<any> },
    Action
  >(reducer, { list: [] });

  let result = trigger.toString();

  useEffect(() => {
    const fn = () => {
      if (!trigger) return 'ciao';
      else return 'hello';
    };
    fn();
  }, [trigger]);

  return (
    <div>
      <div>{list}</div>
      <div>{pagination.totalItems}</div>
      <button
        //onClick={() => dispatch((prev) => ({ perPage: prev.perPage - 1 }))}
        onClick={() => changePage(100)}
        className="mr-2 border-2"
        type="button"
      >
        next
      </button>

      <button
        //onClick={() => dispatch((prev) => ({ perPage: prev.perPage - 1 }))}
        //onClick={() => setTrigger((prev) => !prev)}
        onClick={() =>
          //@ts-expect-error
          dispatch({ type: 'SET_LIST', payload: { list: ['filo'] } })
        }
        className="mr-2 border-2"
        type="button"
      >
        trigger
      </button>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center">
      <TableTril />
      <div
        style={{
          fontFamily: 'Delius Swash Caps, cursive',
          letterSpacing: '3px',
          fontSize: '1rem',
        }}
      >
        <p>
          “Conosci la tua anatomia e la tua fisiologia, ma quando poni le mani
          sul corpo di un paziente, non dimenticare che vi abita un’anima
          vivente”
        </p>
        <p>A.T. Still</p>
      </div>
      <div className="just flex self-stretch items-center gap-4">
        <div className="w-10">
          <div className="border-2 border-gray-900 bg-gray-900"></div>
          <div className="border-4 border-yellow-500 bg-yellow-500"></div>
        </div>
        <div className="text-bold">CHI SONO</div>
      </div>
      <img
        className="rounded-full h-40 w-40"
        src={foto_profilo}
        alt="foto_profilo"
      />
      <div>
        <p className="text-left">
          Sono Matteo e la tua fisiologia, ma quando poni le mani sul corpo di
          un paziente, non dimenticare che vi abita un’anima viv
        </p>
      </div>
    </div>
  );
};
export default HomePage;
