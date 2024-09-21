import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import useActive from '../../hooks/useActive';
import ProductCard from './ProductCard';

const TopProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { activeClass, handleActive } = useActive(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/product/get-all-products");
                const json = await response.json();
                setProducts(json);
                setFilteredProducts(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // making a unique set of product's category
    const productsCategory = [
        'All',
        ...new Set(products.map(item => item.category))
    ];

    // handling product's filtering
    const handleProducts = (category, i) => {
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(item => item.category === category);
            setFilteredProducts(filtered);
        }
        handleActive(i);
    };

    return (
        <>
            <div className="products_filter_tabs">
                <ul className="tabs">
                    {productsCategory.map((item, i) => (
                        <li
                            key={i}
                            className={`tabs_item ${activeClass(i)}`}
                            onClick={() => handleProducts(item, i)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="wrapper products_wrapper">
                {filteredProducts.slice(0, 11).map(item => (
                    <ProductCard
                        key={item._id}
                        {...item}
                    />
                ))}
                <div className="card products_card browse_card">
                    <Link to="/all-products">
                        Browse All <br /> Products <BsArrowRight />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default TopProducts;
