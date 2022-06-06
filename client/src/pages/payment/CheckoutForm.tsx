import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import routes from '../../routes';
import { ACCESS_TOKEN } from '../../constants/constant';
import LoadingService from '../../component/loading/LoadingService';
import { toast } from 'react-toastify';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const TOKEN = localStorage.getItem(ACCESS_TOKEN);
    if (TOKEN) {
      setToken(TOKEN);
    }
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent && paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    LoadingService.show();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://172.27.0.2:3000${routes.HOMEPAGE_BOOKING_SUCCESS}?token=${token}`,
      },
    });
    if (error.type === 'card_error' || error.type === 'validation_error') {
      error.message && toast.error(error.message);
    } else {
      toast.error("Qualcosa e' andato storto");
    }

    LoadingService.hide();
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="payment-button"
      >
        <span id="button-text">Paga - 50.00 euro </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
