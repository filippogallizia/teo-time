import HttpService from '../../services/HttpService';

class PaymentPageApi {
  public createPaymentIntent(body: {
    ammount: number;
    email: string;
    name: string;
  }): Promise<any> {
    const { email, name, ammount } = body;
    return HttpService.post(`/create-payment-intent`, {
      email,
      name,
      ammount,
    });
  }
}

export default new PaymentPageApi();
