import React from 'react';
import './filters.css'


const FilterByName = ({ searchQuery, setSearchQuery }) => {
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="filter-by-name filter-container">
            <h4>Filter by Name</h4>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name"
                className="filter-input"
            />
        </div>
    );
};

export default FilterByName;
