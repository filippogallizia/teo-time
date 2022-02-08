import express, { NextFunction, Request, Response, Router } from 'express';

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

const stripe = require('stripe')(
  process.env.STRIPE_SECRET ?? STRIPE_SECRET_TEST
);

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
          //email: email,
          email: 'filo@filo.com',
        });
        if (customerExist && customerExist.data.length > 0) {
          id = customerExist.data[0].id;
        }

        if (!customerExist || customerExist.data.length === 0) {
          const customer = await stripe.customers.create(
            {
              description: 'My First Test Customer (created for API docs)',
              email: email,
              //source: 'jfdsafjds',
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
      const sig = request.headers['stripe-signature'];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        console.log(err, 'errrrorrrr');
        return;
      }

      let paymentIntent: any;
      switch (event.type) {
        case 'payment_intent.payment_failed':
          paymentIntent = event.data.object;
          console.log(paymentIntent, 'paymentINTENT FINALMENTE LOGGED');
          // Then define and call a function to handle the event payment_intent.payment_failed
          break;
        case 'payment_intent.processing':
          paymentIntent = event.data.object;
          console.log(paymentIntent, 'paymentINTENT FINALMENTE LOGGED');
          // Then define and call a function to handle the event payment_intent.processing
          break;
        case 'payment_intent.succeeded':
          paymentIntent = event.data.object;
          console.log(paymentIntent, 'paymentINTENT FINALMENTE LOGGED');
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send(event);
    }
  );
};