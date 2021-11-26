import React from 'react';
import foto_profilo from '../../shared/images/foto_profilo.jpeg';
import { TITLE } from '../../shared/locales/constant';
import ocean from '../../shared/images/ocean.jpg';
import { SelfCenterLayout } from '../../component/GeneralLayouts';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center">
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
          <div className="border-2 border-gray-900"></div>
          <div className="border-4 border-yellow-500"></div>
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
