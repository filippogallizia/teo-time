import express, { NextFunction, Request, Response, Router } from 'express';
import Stripe from 'stripe';

const PaymentRouter = express.Router();

const { authenticateToken } = require('../../middleware/middleware');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_8191fe0ce40535369b354b20470c927cd8f56972068c683d228fbfc9a72ca2bf';

const STRIPE_SECRET_TEST =
  'sk_test_51K5AW1G4kWNoryvxAZVOFwVPZ6qyVKUqZJslh0UYiNlU0aDb3hd0ksS0zCBWbyXUvDKB6f9CA9RvU3Gwc2rfBtsw00lC98E85E';

const calculateOrderAmount = (ammount: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return ammount * 10;
};

const stripe = new Stripe(process.env.STRIPE_SECRET ?? STRIPE_SECRET_TEST, {
  apiVersion: '2020-08-27',
});

//const stripe = require('stripe')(
//  process.env.STRIPE_SECRET ?? STRIPE_SECRET_TEST
//);

export default (app: Router) => {
  app.use('/payments', PaymentRouter);

  PaymentRouter.post(
    '/create-payment-intent',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const { ammount, email, name, idempotencyKey } = req.body;
      let id = '';

      try {
        const customerExist = await stripe.customers.list({
          email: email,
        });
        console.log(customerExist, 'customeREx');

        if (customerExist && customerExist.data.length > 0) {
          id = customerExist.data[0].id;
        }

        if (!customerExist || customerExist.data.length === 0) {
          const customer = await stripe.customers.create(
            {
              email: email,
              name: name,
            },
            {
              idempotencyKey: idempotencyKey,
            }
          );
          id = customer.id;
        }
        const paymentIntent = await stripe.paymentIntents.create({
          setup_future_usage: 'off_session',
          customer: id,
          amount: calculateOrderAmount(ammount),
          currency: 'eur',
          automatic_payment_methods: {
            enabled: true,
          },
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e: any) {
        next(e);
      }
    }
  );

  PaymentRouter.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
      let event = request.body;
      const sig = request.headers['stripe-signature'];

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          //@ts-expect-error
          sig,
          endpointSecret
        );
      } catch (err: any) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        console.log(err);
        return;
      }

      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`
          );
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        }
        case 'payment_method.attached': {
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          break;
        }
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send(event);
    }
  );
};
