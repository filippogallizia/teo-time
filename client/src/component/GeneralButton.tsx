import React, { Dispatch, SetStateAction } from 'react';

type GeneralButtonType = {
  buttonText: string | number | any;
  onClick?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
  secondary?: boolean;
  error?: boolean;
};

export const primaryButton = (
  isEnable: boolean,
  secondary?: boolean,
  error?: boolean
): string => {
  return isEnable
    ? 'bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded cursor-pointer'
    : 'bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded cursor-pointer disabled:bg-yellow-500 opacity-50 cursor-not-allowed';
};

export const secondaryButton = (isEnable: boolean): string => {
  return isEnable
    ? 'border-2 border-yellow-500 hover:border-yellow-700  font-bold py-2 px-4 rounded cursor-pointer'
    : 'bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded cursor-pointer disabled:bg-yellow-500 opacity-50 cursor-not-allowed';
};

export const errorButton = (isEnable: boolean): string => {
  return isEnable
    ? 'bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded cursor-pointer'
    : 'bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded cursor-pointer disabled:bg-yellow-500 opacity-50 cursor-not-allowed';
};

function GeneralButton({
  buttonText,
  onClick,
  disabled,
  secondary,
  error,
}: GeneralButtonType) {
  const pickStyle = () => {
    const key = secondary ?? error;
    switch (key) {
      case undefined:
        return primaryButton(!disabled);
      case secondary:
        return secondaryButton(!disabled);
      case error:
        return errorButton(!disabled);
    }
  };

  return (
    <div>
      <button disabled={disabled} onClick={onClick} className={pickStyle()}>
        {buttonText}
      </button>
    </div>
  );
}

export default GeneralButton;
