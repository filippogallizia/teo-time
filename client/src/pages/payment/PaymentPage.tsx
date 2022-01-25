import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
import './payment.css';
import { BookingComponentType } from '../booking/BookingPageTypes';
import LoadingService from '../../component/loading/LoadingService';

import PaymentPageApi from './PaymentPageApi';
import EventListener from '../../helpers/EventListener';
import SessionService from '../../services/SessionService';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

const PUBLISHABLE_KEY =
  'pk_test_51K5AW1G4kWNoryvx79L6ApGntu5LQdWY8GK3uduUxFCrUhZ1aLsG3pfecMyI1Jz6cHf9beSWzdHYq3TYWpz1zFfD00y9Fhr61x';

export default function App({ dispatch, state }: BookingComponentType) {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise] = useState(() => loadStripe(PUBLISHABLE_KEY));

  useEffect(() => {
    const user = SessionService.getUser();
    if (user && user.email && user.name) {
      const payload = {
        ammount: 50,
        email: user.email,
        name: user.name,
      };
      LoadingService.show();
      const asyncFn = async () => {
        try {
          const response = await PaymentPageApi.createPaymentIntent(payload);
          setClientSecret(response.clientSecret);
        } catch (e) {
          EventListener.emit('errorHandling', true);
        } finally {
          LoadingService.hide();
        }
      };
      asyncFn();
    }
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        //@ts-expect-error
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm dispatch={dispatch} state={state} />
        </Elements>
      )}
    </div>
  );
}
