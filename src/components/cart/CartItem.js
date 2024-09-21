import React, { useContext } from 'react';
import { TbTrash } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { displayMoney } from '../../helpers/utils';
import cartContext from '../../contexts/cart/cartContext';
import QuantityBox from '../common/QuantityBox';


const CartItem = (props) => {

    console.log("cartPropsss", props)

    const { id, images, title, description, price, discountPrice, quantity, path } = props;

    const { removeItem } = useContext(cartContext);

    const newPrice = displayMoney(price);
    const oldPrice = displayMoney(discountPrice);


    return (
        <>
            <div className="cart_item">
                <figure className="cart_item_img">
                    <Link to={`${path}${id}`}>
                        <img src={images[0]?.url} alt="product-img" />
                    </Link>
                </figure>
                <div className="cart_item_info">
                    <div className="cart_item_head">
                        <h4 className="cart_item_title">
                            <Link to={`/product-details/${id}`}><b>{title}</b> <br></br>{description}</Link>
                        </h4>
                        <div className="cart_item_del">
                            <span onClick={() => removeItem(id)}>
                                <TbTrash />
                            </span>
                            <div className="tooltip">Remove Item</div>
                        </div>
                    </div>

                    <h2 className="cart_item_price">
                        {newPrice} &nbsp;
                        <small><del>{oldPrice}</del></small>
                    </h2>

                    <QuantityBox itemId={id} itemQuantity={quantity} />
                </div>
            </div>
        </>
    );
};

export default CartItem;