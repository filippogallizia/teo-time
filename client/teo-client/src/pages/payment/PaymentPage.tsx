import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
import './payment.css';
import { BookingComponentType } from '../booking/BookingPageTypes';
import LoadingService from '../../component/loading/LoadingService';
import { UserContext } from '../../component/UserContext';
import { CreatePaymentIntent } from './PaymentService';
import { toast } from 'react-toastify';
import { handleToastInFailRequest } from '../../shared/locales/utils';
import { SET_SHOW_MODAL } from '../booking/stateReducer';
import Modal from '../../component/Modal';
import EventListener from '../../helpers/EventListener';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

const stripePromise = loadStripe(
  'pk_test_51K5AW1G4kWNoryvx79L6ApGntu5LQdWY8GK3uduUxFCrUhZ1aLsG3pfecMyI1Jz6cHf9beSWzdHYq3TYWpz1zFfD00y9Fhr61x'
);

export default function App({ dispatch, state }: BookingComponentType) {
  const [clientSecret, setClientSecret] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const payload = {
      ammount: 50,
      email: user.email,
      name: user.name,
    };
    LoadingService.show();

    const handleSuccess = (response: any) => {
      setClientSecret(response.clientSecret);
      LoadingService.hide();
    };
    const asyncFn = async () => {
      try {
        await CreatePaymentIntent(handleSuccess, payload);
      } catch (e) {
        LoadingService.hide();
        EventListener.emit('errorHandling', true);
      }
    };
    asyncFn();
  }, [user]);

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
      {/*<Modal state={state} dispatch={dispatch}>
        <p>qualcosa e' andato stroto</p>
      </Modal>*/}
    </div>
  );
}
