import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper';
import productsData from '../../data/productsData';
import ProductCard from '../product/ProductCard';

import 'swiper/scss';
import 'swiper/scss/pagination';


const RelatedSlider = (props) => {

    const [products, setProducts] = useState(productsData);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/product/get-all-products");
                const json = await response.json();
                console.log("json::", json);
                setProducts(json)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const { category } = props;

    const relatedProduct = products.filter(item => item.category === category);

    return (
        <Swiper
            modules={[Pagination, A11y]}
            spaceBetween={10}
            slidesPerView={"auto"}
            pagination={{ clickable: true }}
            breakpoints={{
                480: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 4,
                },
            }}
            className="related_swiper"
        >
            {
                relatedProduct.map(item => (
                    <SwiperSlide key={item.id}>
                        <ProductCard {...item} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default RelatedSlider;