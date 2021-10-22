import React, { Dispatch, SetStateAction } from 'react';

type GeneralButtonType = {
  buttonText: string | number;
  onClick?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
};

function GeneralButton({ buttonText, onClick, disabled }: GeneralButtonType) {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-500 opacity-50 cursor-not-allowed "
      >
        {buttonText}
      </button>
    </div>
  );
}

export default GeneralButton;
