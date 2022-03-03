import { isProduction } from './environment';

export const URL_CLIENT = isProduction
  ? 'https://osteotherapy.it'
  : 'http://localhost:3000';

export const URL_SERVER = isProduction
  ? 'http://0.0.0.0:5000'
  : 'http://0.0.0.0:5000';

export const ACCESS_TOKEN = 'access_token';
export const CURRENT_USER_ROLE = 'CURRENT_USER_ROLE';
export const BOOKING_INFO = 'BOOKING_INFO';
export const USER_INFO = 'USER_INFO';

export const TAILWIND_MOBILE_BREAKPOINT = 768;

//sharedClasses
export const GENERAL_FONT = 'font-sans';
export const TITLE = 'text-2xl font-bold tracking-wide';
export const SUB_TITLE = 'text-xl';
export const EVENT_INFO_TEXT = 'italic';
export const SECONDARY_LINK = 'cursor-pointer underline';
export const SECONDARY_BUTTON =
  'bg-transparent hover:bg-yellow-500 font-semibold py-2 px-4 border border-yellow-500 hover:border-transparent rounded';

//padding and margins
export const GLOBAL_PADDING = 'p-4';
export const SMALLPADDING = 'p-2';
export const BIGPADDING = 'p-8';
export const MARGIN_BOTTOM = 'mb-2';
export const MEDIUM_MARGIN_BOTTOM = 'mb-5';
export const MEDIUM_MARGIN_TOP = 'mt-5';
export const BIG_MARGIN_BOTTOM = 'mb-10';
export const BIG_MARGIN_TOP = 'mt-10';
export const MARGIN_RIGHT = 'mr-2';
export const MARGIN_LEFT = 'ml-2';
export const MARGIN_TOP = 'mt-2';

//font size
export const PARAGRAPH_SMALL = 'text-xs';
export const PARAGRAPH_MEDIUM = 'text-xl';
export const PARAGRAPH_BIG = 'text-3xl';
export const BOLD = 'font-bold';
export const ITALIC = 'italic';

// flex box
export const FLEX_DIR_COL = 'flex flex-col justify-center items-center';
export const FLEX_DIR_ROW = 'flex  justify-center items-center';

// grid
export const GRID_ONE_COL = 'grid col-1 gap-4 justify-items-center';

// borders
export const BORDERS_GRAY = 'border-2 border-gray-200';
export const MY_DIVIDER = 'border-b-2 border-gray-400';

// colors
export const BLUE_PRIMARY = '#006edc';
