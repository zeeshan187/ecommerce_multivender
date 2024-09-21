import React from 'react';
import './filters.css'

const FilterByPrice = ({ minPrice, maxPrice, selectedPrice, setSelectedPrice }) => {
    const handlePriceChange = (event) => {
        setSelectedPrice(event.target.value);
    };

    return (
        <div className="filter-by-price filter-container">
            <h4>Filter by Price</h4>
            <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={selectedPrice}
                onChange={handlePriceChange}
                className="filter-input"
            />
            <p>Selected Price: ${selectedPrice}</p>
        </div>
    );
};

export default FilterByPrice;
