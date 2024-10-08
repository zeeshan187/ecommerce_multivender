import React, { useContext, useState } from 'react';
import { BsCartX } from 'react-icons/bs';
import { calculateTotal, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import cartContext from '../contexts/cart/cartContext';
import CartItem from '../components/cart/CartItem';
import EmptyView from '../components/common/EmptyView';
import Footer from '../components/common/Footer';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '../components/StripeCheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

const Cart = () => {

    useDocTitle('Cart');

    const { cartItems } = useContext(cartContext);
    const [showCheckout, setShowCheckout] = useState(false);

    const cartQuantity = cartItems.length;

    // total original price
    const cartTotal = cartItems.map(item => {
        return item.price * item.quantity;
    });

    const calculateCartTotal = calculateTotal(cartTotal);
    const displayCartTotal = displayMoney(calculateCartTotal);

    // total discount
    const cartDiscount = cartItems.map(item => {
        return (item.discountPrice) * item.quantity;
    });

    const calculateCartDiscount = calculateTotal(cartDiscount);
    const displayCartDiscount = displayMoney(calculateCartDiscount);

    // final total amount
    const totalAmount = calculateCartTotal - calculateCartDiscount;
    const displayTotalAmount = displayMoney(totalAmount);

    const handleCheckoutClick = () => {
        setShowCheckout(true);
    };

    const handleCloseCheckout = () => {
        setShowCheckout(false);
    };

    return (
        <>
            <section id="cart" className="section">
                <div className="container">
                    {
                        cartQuantity === 0 ? (
                            <EmptyView
                                icon={<BsCartX />}
                                msg="Your Cart is Empty"
                                link="/all-products"
                                btnText="Start Shopping"
                            />
                        ) : (
                            <div className="wrapper cart_wrapper">
                                <div className="cart_left_col">
                                    {
                                        cartItems.map(item => (
                                            <CartItem
                                                key={item.id}
                                                {...item}
                                            />
                                        ))
                                    }
                                </div>

                                <div className="cart_right_col">
                                    <div className="order_summary">
                                        <h3>
                                            Order Summary &nbsp;
                                            ( {cartQuantity} {cartQuantity > 1 ? 'items' : 'item'} )
                                        </h3>
                                        <div className="order_summary_details">
                                            <div className="price">
                                                <span>Original Price</span>
                                                <b>{displayCartTotal}</b>
                                            </div>
                                            <div className="discount">
                                                <span>Discount</span>
                                                <b>- {displayCartDiscount}</b>
                                            </div>
                                            <div className="delivery">
                                                <span>Delivery</span>
                                                <b>Free</b>
                                            </div>
                                            <div className="separator"></div>
                                            <div className="total_price">
                                                <b><small>Total Price</small></b>
                                                <b>{displayTotalAmount}</b>
                                            </div>
                                        </div>
                                        <button type="button" className="btn checkout_btn" onClick={handleCheckoutClick}>
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
            <Footer />
            {showCheckout && (
                <div className="checkout_popup" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Elements stripe={stripePromise}>
                        <StripeCheckoutForm totalAmount={totalAmount} onClose={handleCloseCheckout} />
                    </Elements>
                </div>
            )}
        </>
    );
};

export default Cart;