import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { dropdownMenu } from '../../data/headerData';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import AccountForm from '../form/AccountForm';
import SearchBar from './SearchBar';

const Header = () => {
    const { toggleForm, toggleSearch } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const storedUserDetails = sessionStorage.getItem('userDetails');
        if (storedUserDetails) {
            try {
                const parsedUserDetails = JSON.parse(storedUserDetails);
                setUserDetails(parsedUserDetails);
            } catch (error) {
                console.error('Error parsing user details:', error);
            }
        }
    }, []);

    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);
        window.addEventListener('scroll', handleIsSticky);
        return () => window.removeEventListener('scroll', handleIsSticky);
    }, [isSticky]);

    const cartQuantity = cartItems.length;

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem('userDetails');
        setUserDetails(null);
    };

    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">E_Com Market Place</Link>
                        </h2>
                        <nav className="nav_actions">
                            <div className="search_action">
                                <span onClick={() => toggleSearch(true)}>
                                    <AiOutlineSearch />
                                </span>
                                <div className="tooltip">Search</div>
                            </div>
                            <div className="cart_action">
                                <Link to="/cart">
                                    <AiOutlineShoppingCart />
                                    {cartQuantity > 0 && <span className="badge">{cartQuantity}</span>}
                                </Link>
                                <div className="tooltip">Cart</div>
                            </div>
                            <div className="user_action">
                                <span><AiOutlineUser /></span>
                                <div className="dropdown_menu">
                                    {userDetails ? (
                                        <>
                                            <h4>Hello! {userDetails.firstname} {userDetails.lastname}</h4>
                                            <p>Access account and manage orders</p>
                                            <button type="button" onClick={handleLogout}>Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <h4>Hello!</h4>
                                            <p>Access account and manage orders</p>
                                            <button type="button" onClick={() => toggleForm(true)}>Login / Signup</button>
                                        </>
                                    )}
                                    <div className="separator"></div>
                                    <ul>
                                        {dropdownMenu.map(item => (
                                            <li key={item.id}><Link to={item.path}>{item.link}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            <SearchBar />
            <AccountForm />
        </>
    );
};

export default Header;
