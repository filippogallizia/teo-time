import HttpService from '../../services/HttpService';

class PaymentPageApi {
  public createPaymentIntent(body: {
    email: string;
    name: string;
    idempotencyKey: string;
  }): Promise<any> {
    const { email, name, idempotencyKey } = body;
    return HttpService.post(`/payments/create-payment-intent`, {
      email,
      name,
      idempotencyKey,
    });
  }
}

export default new PaymentPageApi();
