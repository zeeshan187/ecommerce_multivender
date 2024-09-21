import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ totalAmount, orderId, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalAmount, currency: 'USD' }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            const { clientSecret } = data;

            const confirmedPayment = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (confirmedPayment.error) {
                setError(confirmedPayment.error.message);
            } else if (confirmedPayment.paymentIntent.status === 'succeeded') {
                const successResponse = await fetch('http://localhost:5000/api/payments/payment-success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderId, paymentIntentId: confirmedPayment.paymentIntent.id }),
                });

                const successData = await successResponse.json();
                if (!successResponse.ok) throw new Error(successData.message);

                console.log('Payment succeeded:', successData);
                onClose(); // Close the form on success
            }
        } catch (error) {
            setError(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#000', position: 'relative', width: '400px', padding: '30px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '26px', cursor: 'pointer' }}>×</button>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label>Total Amount: ${totalAmount.toFixed(2)}</label>
                </div>
                <div style={{ marginBottom: '40px' }}><CardElement /></div>
                <button type="submit" disabled={!stripe || isProcessing} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {isProcessing ? 'Processing...' : 'Pay'}
                </button>
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </form>
        </div>
    );
};

export default StripeCheckoutForm;
