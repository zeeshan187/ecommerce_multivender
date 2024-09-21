import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdStar, IoMdCheckmark } from 'react-icons/io';
import { calculateDiscount, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import useActive from '../hooks/useActive';
import cartContext from '../contexts/cart/cartContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import { TextureLoader } from 'three';
import SectionsHead from '../components/common/SectionsHead';
import RelatedSlider from '../components/sliders/RelatedSlider';
import ProductSummary from '../components/product/ProductSummary';
import Services from '../components/common/Services';
import Footer from '../components/common/Footer';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const { handleActive, activeClass } = useActive(0);
    const { addItem } = useContext(cartContext);

    useDocTitle('Product Details');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/product/get-product-by-id/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                console.log("json::", json);
                setProduct(json);
                setPreviewImg(json.images ? json.images[0].url : '');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [productId]);

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setPreviewImg(product.images[0]?.url);
            handleActive(0);
        }
    }, [product, handleActive]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const { images, title, description, category, price, discountPrice, ratings } = product;

    const handleAddItem = () => { addItem(product) };

    const handlePreviewImg = (i) => {
        setPreviewImg(images[i].url);
        handleActive(i);
    };

    const discountedPrice = discountPrice - price;
    const newPrice = displayMoney(price);
    const oldPrice = displayMoney(discountPrice);
    const savedPrice = displayMoney(discountedPrice);
    const savedDiscount = calculateDiscount(discountedPrice, discountPrice);

    return (
        <>
            <section id="product_details" className="section">
                <div className="container">
                    <div className="wrapper prod_details_wrapper">
                        <div className="prod_details_left_col">
                            <div className="prod_details_tabs">
                                {images && images.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`tabs_item ${activeClass(i)}`}
                                        onClick={() => handlePreviewImg(i)}
                                    >
                                        <img src={img?.url} alt="product-img" />
                                    </div>
                                ))}
                            </div>
                            <figure className="prod_details_img">
                                <Canvas style={{ height: '800px', width: '800px' }}>
                                    <OrbitControls enableZoom={true} enablePan={true} />
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[0, 5, 5]} />
                                    <mesh rotation={[0, 0, 0]} onClick={() => console.log('Box clicked!')}>
                                        <boxGeometry args={[3, 3, 3]} />
                                        <meshStandardMaterial map={new TextureLoader().load(previewImg)} />
                                    </mesh>
                                    <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                                        <meshStandardMaterial color="#cccccc" />
                                    </Plane>
                                </Canvas>
                            </figure>
                        </div>
                        <div className="prod_details_right_col">
                            <h1 className="prod_details_title">{title}</h1>
                            <h4 className="prod_details_info">{description}</h4>
                            <div className="prod_details_ratings">
                                <span className="rating_star">
                                    {[...Array(ratings)].map((_, i) => <IoMdStar key={i} />)}
                                </span>
                                <span>|</span>
                                <Link to="#">{ratings.length} Ratings</Link>
                            </div>
                            <div className="separator"></div>
                            <div className="prod_details_price">
                                <div className="price_box">
                                    <h2 className="price">
                                        {newPrice} &nbsp;
                                        <small className="del_price"><del>{oldPrice}</del></small>
                                    </h2>
                                    <p className="saved_price">You save: {savedPrice} ({savedDiscount}%)</p>
                                    <span className="tax_txt">(Inclusive of all taxes)</span>
                                </div>
                                <div className="badge">
                                    <span><IoMdCheckmark /> In Stock</span>
                                </div>
                            </div>
                            <div className="separator"></div>
                            <div className="prod_details_offers">
                                <h4>Offers and Discounts</h4>
                                <ul>
                                    <li>No Cost EMI on Credit Card</li>
                                    <li>Pay Later & Avail Cashback</li>
                                </ul>
                            </div>
                            <div className="separator"></div>
                            <div className="prod_details_buy_btn">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handleAddItem}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ProductSummary {...product} />
            <section id="related_products" className="section">
                <div className="container">
                    <SectionsHead heading="Related Products" />
                    <RelatedSlider category={category} />
                </div>
            </section>
            <Services />
            <Footer />
        </>
    );
};

export default ProductDetails;
