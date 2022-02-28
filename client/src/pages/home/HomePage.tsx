import React, { useState } from 'react';
import { useTable } from 'src/shared/hooks/useTable/useTable';
import foto_profilo from '../../shared/images/foto_profilo.jpeg';

const TableTril = () => {
  const [state, dispatch] = useState({ perPage: 1 });
  const table = useTable({ dispatch: dispatch, initialState: state });
  return (
    <div>
      <div>{JSON.stringify(table)}</div>
      <button
        onClick={() => dispatch((prev) => ({ perPage: prev.perPage + 1 }))}
        className="mr-2 border-2"
        type="button"
      >
        previous
      </button>
      <button
        //onClick={() => dispatch((prev) => ({ perPage: prev.perPage - 1 }))}
        onClick={() => table(100)}
        className="mr-2 border-2"
        type="button"
      >
        next
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
