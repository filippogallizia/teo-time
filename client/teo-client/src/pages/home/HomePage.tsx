import React from 'react';
import mainImage from '../../shared/images/mainImage.jpeg';
import { TITLE } from '../../shared/locales/constant';
import ocean from '../../shared/images/ocean.jpg';
import { SelfCenterLayout } from '../../component/GeneralLayouts';

const HomePage = () => {
  return (
    <div
      style={{
        fontFamily: 'Delius Swash Caps, cursive',
        letterSpacing: '3px',
        fontSize: '1.3rem',
        maxWidth: '300px',
        // backgroundImage: `url(${ocean})`,
      }}
      className="flex flex-col gap-4 items-center justify-center text-center"
    >
      {/* <img src={ocean} /> */}
      <p>
        “Conosci la tua anatomia e la tua fisiologia, ma quando poni le mani sul
        corpo di un paziente, non dimenticare che vi abita un’anima vivente”
      </p>
      <p>A.T. Still</p>
    </div>
  );
};
export default HomePage;
