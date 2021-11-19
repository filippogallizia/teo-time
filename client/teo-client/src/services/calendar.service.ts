import axios from 'axios';
import { ACCESS_TOKEN } from '../shared/locales/constant';

import { ENDPOINT } from '../api';

export const getAvailabilities = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  const bodyToSend = { TimeRangeType: [{ start, end }] };

  try {
    console.log(ENDPOINT, 'ENDPOINT');

    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/retrieveAvailability`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        ...bodyToSend,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const createBooking = async (
  fn: any,
  body: {
    start: string;
    end: string;
    isHoliday?: boolean;
    localId?: number;
  }
) => {
  try {
    const { start, end, isHoliday, localId } = body;
    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/createBooking`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        start,
        end,
        isHoliday,
        localId,
      },
    });

    fn(response.data);
  } catch (e) {
    throw e;
  }
};
