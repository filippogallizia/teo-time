import axios from 'axios';
import { URL } from '../../config';

const getBooking = async () => {
  axios.post(`${URL}/retrievebooking`);
};
