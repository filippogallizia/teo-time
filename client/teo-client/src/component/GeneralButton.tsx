import React, { Dispatch, SetStateAction } from 'react';

type GeneralButtonType = {
  buttonText: string | number;
  onClick: Dispatch<SetStateAction<any>>;
};

function GeneralButton({ buttonText, onClick }: GeneralButtonType) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default GeneralButton;
