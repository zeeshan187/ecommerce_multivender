import React, { useEffect, useState } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle.js';
import ProductCard from '../components/product/ProductCard.js';
import Services from '../components/common/Services.js';
import EmptyView from '../components/common/EmptyView.js';
import Footer from '../components/common/Footer.js';
import FilterByPrice from '../components/filters/FilterByPrice.jsx';
import FilterByCategory from '../components/filters/FilterByCategory';
import FilterByName from '../components/filters/FilterByName';

const AllProducts = () => {
    useDocTitle('All Products');

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedPrice, setSelectedPrice] = useState(maxPrice);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/product/get-all-products");
                const json = await response.json();
                setProducts(json);
                setFilteredProducts(json);

                const prices = json.map(product => product.price);
                setMinPrice(Math.min(...prices));
                setMaxPrice(Math.max(...prices));
                setSelectedPrice(Math.max(...prices));

                const uniqueCategories = [...new Set(json.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedPrice, selectedCategory, searchQuery]);

    const applyFilters = () => {
        let filtered = products;

        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        filtered = filtered.filter(product => product.price <= selectedPrice);

        setFilteredProducts(filtered);
    };

    return (
        <>
            <section id="all_products" className="section">
                <div className="filters">
                    <FilterByPrice
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        selectedPrice={selectedPrice}
                        setSelectedPrice={setSelectedPrice}
                    />
                    <FilterByCategory
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <FilterByName
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>
                <div className="container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredProducts.length ? (
                        <div className="wrapper products_wrapper">
                            {filteredProducts.map(item => (
                                <ProductCard
                                    key={item._id}
                                    {...item}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyView
                            icon={<BsExclamationCircle />}
                            msg="No Results Found"
                        />
                    )}
                </div>
            </section>

            <Services />
            <Footer />
        </>
    );
};

export default AllProducts;
