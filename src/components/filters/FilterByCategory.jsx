import React from 'react';
import './filters.css'


const FilterByCategory = ({ categories, selectedCategory, setSelectedCategory }) => {
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div className="filter-by-category filter-container">
            <h4>Filter by Category</h4>
            <select value={selectedCategory} onChange={handleCategoryChange} className="filter-input">
                <option value="">All</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterByCategory;
