import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Routes from '../../routes';

import CheckoutForm from './CheckoutForm';
import './payment.css';
import { BookingComponentType } from '../booking/BookingPageTypes';
import LoadingService from '../../component/loading/LoadingService';

import PaymentPageApi from './PaymentPageApi';
import EventListener from '../../helpers/EventListener';
import SessionService from '../../services/SessionService';
import { v4 } from 'uuid';
import GeneralButton from '../../component/GeneralButton';
import { useHistory } from 'react-router-dom';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

const PUBLISHABLE_KEY =
  'pk_test_51K5AW1G4kWNoryvx79L6ApGntu5LQdWY8GK3uduUxFCrUhZ1aLsG3pfecMyI1Jz6cHf9beSWzdHYq3TYWpz1zFfD00y9Fhr61x';

const idempotencyKey = v4();

export default function App({ dispatch, state }: BookingComponentType) {
  const [clientSecret, setClientSecret] = useState('');
  const [payInClinic, setPayInClinic] = useState(false);
  const [stripePromise] = useState(() => loadStripe(PUBLISHABLE_KEY));
  const history = useHistory();

  useEffect(() => {
    const user = SessionService.getUser();
    if (user && user.email && user.name) {
      const payload = {
        ammount: 50,
        email: user.email,
        name: user.name,
        idempotencyKey: idempotencyKey,
      };
      LoadingService.show();
      const asyncFn = async () => {
        try {
          const response = await PaymentPageApi.createPaymentIntent(payload);
          setClientSecret(response.clientSecret);
        } catch (e) {
          EventListener.emit('errorHandling', true);
          setClientSecret('failed');
        } finally {
          setPayInClinic(true);
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
    <div className="grid grid-cols-1 gap-4">
      {clientSecret && (
        <div className="App">
          {/*@ts-expect-error*/}
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      )}

      {clientSecret === 'failed' && (
        <p>Pagamento digitale non disponibile al momento</p>
      )}

      {payInClinic && (
        <div className="grid grid-cols-1 gap-4 justify-items-center">
          <p className="col-span-1">oppure</p>
          <GeneralButton
            buttonText="Paga in clinica"
            secondary={true}
            onClick={() => history.push(Routes.HOMEPAGE_BOOKING_SUCCESS)}
          />
        </div>
      )}
    </div>
  );
}
