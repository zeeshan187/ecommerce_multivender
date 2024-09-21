import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import cartContext from '../../contexts/cart/cartContext';

const QuantityBox = ({ itemId, itemQuantity }) => {
    const { incrementItem, decrementItem } = useContext(cartContext);
    const [quantity, setQuantity] = useState(1); // Start from 1

    useEffect(() => {
        if (itemQuantity && itemQuantity !== quantity) {
            setQuantity(itemQuantity);
        }
    }, [itemQuantity]);

    const handleIncrement = () => {
        const updatedQuantity = incrementItem(itemId);
        setQuantity(updatedQuantity);
    };

    const handleDecrement = () => {
        const updatedQuantity = decrementItem(itemId);
        setQuantity(updatedQuantity);
    };

    return (
        <div className="quantity_box">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                <FaMinus />
            </button>
            <span className="quantity_count">
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= 5}
            >
                <FaPlus />
            </button>
        </div>
    );
};

export default QuantityBox;
