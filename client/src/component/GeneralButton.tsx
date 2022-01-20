import React, { Dispatch, SetStateAction } from 'react';

type GeneralButtonType = {
  buttonText: string | number | any;
  onClick?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
};
export const buttonStyle = (isEnable: boolean): string => {
  return isEnable
    ? 'bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded'
    : 'bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded disabled:bg-yellow-500 opacity-50 cursor-not-allowed';
};

function GeneralButton({ buttonText, onClick, disabled }: GeneralButtonType) {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={onClick}
        className={buttonStyle(!disabled)}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default GeneralButton;
