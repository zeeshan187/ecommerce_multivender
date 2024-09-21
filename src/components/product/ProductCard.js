import React, { useState } from 'react';
import { IoMdStar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { displayMoney } from '../../helpers/utils';

const ProductCard = (props) => {
    const { _id, images, title, info, price, discountPrice, rateCount } = props;
    const newPrice = displayMoney(price);
    const oldPrice = displayMoney(discountPrice);

    return (
        <div className="products_card">
            <figure className="products_img">
                <Link to={`/product-details/${_id}`}>
                    <img src={images?.[0]?.url} alt="product-img" />
                </Link>
            </figure>
            <div className="products_details">
                <span className="rating_star">
                    {[...Array(rateCount)].map((_, i) => <IoMdStar key={i} />)}
                </span>
                <h3 className="products_title">
                    <Link to={`/product-details/${_id}`}>{title}</Link>
                </h3>
                <h5 className="products_info">{info}</h5>
                <div className="separator"></div>
                <h2 className="products_price">
                    {newPrice} &nbsp;
                    <small><del>{oldPrice}</del></small>
                </h2>
                <Link to={`/product-details/${_id}`}>
                    <button type="button" className={`btn products_btn`} >More Detail</button>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
