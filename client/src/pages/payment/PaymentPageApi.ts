import axios from 'axios';
import { ENDPOINT } from '../../api';
import HttpService from '../../services/HttpService';

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

class PaymentPageApi {
  public createPaymentIntent(body: {
    ammount: number;
    email: string;
    name: string;
  }): Promise<any> {
    const { email, name, ammount } = body;
    return HttpService.post(`${ENDPOINT}/create-payment-intent`, {
      email,
      name,
      ammount,
    });
  }
}

export default new PaymentPageApi();
