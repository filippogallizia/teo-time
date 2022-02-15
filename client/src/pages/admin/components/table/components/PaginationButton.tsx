import React, { Dispatch, SetStateAction } from 'react';

type GeneralButtonType = {
  buttonText: string | number | any;
  onClick?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
  secondary?: boolean;
  error?: boolean;
};

const makeStyle = (disabled: boolean | undefined): string => {
  return disabled
    ? 'bg-yellow-500 hover:bg-yellow-700  font-bold px-2 rounded cursor-pointer disabled:bg-yellow-500 opacity-50 cursor-not-allowed'
    : 'bg-yellow-500 hover:bg-yellow-700  font-bold px-2 rounded cursor-pointer';
};

function PaginationButton({
  buttonText,
  onClick,
  disabled,
  secondary,
  error,
}: GeneralButtonType) {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={onClick}
        className={makeStyle(disabled)}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default PaginationButton;
