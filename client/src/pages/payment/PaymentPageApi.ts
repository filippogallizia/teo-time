import HttpService from '../../services/HttpService';

class PaymentPageApi {
  public createPaymentIntent(body: {
    ammount: number;
    email: string;
    name: string;
    idempotencyKey: string;
  }): Promise<any> {
    const { email, name, ammount, idempotencyKey } = body;
    return HttpService.post(`/create-payment-intent`, {
      email,
      name,
      ammount,
      idempotencyKey,
    });
  }
}

export default new PaymentPageApi();
