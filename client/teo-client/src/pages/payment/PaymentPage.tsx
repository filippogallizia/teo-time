import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
import './payment.css';
import { BookingComponentType } from '../booking/BookingPageTypes';
import LoadingService from '../../component/loading/LoadingService';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

const stripePromise = loadStripe(
  'pk_test_51K5AW1G4kWNoryvx79L6ApGntu5LQdWY8GK3uduUxFCrUhZ1aLsG3pfecMyI1Jz6cHf9beSWzdHYq3TYWpz1zFfD00y9Fhr61x'
);

export default function App({ dispatch, state }: BookingComponentType) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    LoadingService.show();
    // Create PaymentIntent as soon as the page loads
    fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ammount: 10 }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        LoadingService.hide();
        setClientSecret(data.clientSecret);
      });
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
