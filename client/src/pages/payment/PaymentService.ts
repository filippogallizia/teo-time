import axios from 'axios';
import { ENDPOINT } from '../../api';

export const CreatePaymentIntent = async (
  fn: any,
  body: { ammount: number; email: string; name: string }
) => {
  try {
    const { email, name, ammount } = body;
    const response = await axios.post(`${ENDPOINT}/create-payment-intent`, {
      email,
      name,
      ammount,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
