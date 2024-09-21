import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import useForm from '../../hooks/useForm';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountForm = () => {
    const { isFormOpen, toggleForm } = useContext(commonContext);
    const { inputValues, handleInputValues } = useForm();
    let navigate = useNavigate();
    const formRef = useRef();

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });

    useScrollDisable(isFormOpen);

    const [isSignupVisible, setIsSignupVisible] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    // Check if user is already logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem('userDetails');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to update header with user details
    const updateHeader = (userData) => {
        // Implement the logic to update header with user data
    };

    // Signup-form visibility toggling
    const handleIsSignupVisible = () => {
        setIsSignupVisible(prevState => !prevState);

        // Prefill login fields if switching to login form
        if (isSignupVisible) {
            handleInputValues({ target: { name: 'mail', value: signupEmail } });
            handleInputValues({ target: { name: 'password', value: signupPassword } });
        }
    };

    // Handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!isSignupVisible) {
            // Login API call
            try {
                const response = await axios.post('http://localhost:5000/api/user/login', {
                    email: inputValues.mail,
                    password: inputValues.password
                });

                console.log("response",response)
    
                if (response?.data?.status === 200) {
                    const userData = response.data;
                    updateHeader(userData);
                    sessionStorage.setItem('userDetails', JSON.stringify(userData));
                    toast.success("Login Successfully");
                    toggleForm(false);
                    setIsLoggedIn(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Login error:', error.response ? error.response.data : error.message);
                toast.warning("Email or Password is not correct");
            }
        } else {
            // Check if passwords match
            if (inputValues.password !== inputValues.conf_password) {
                toast.warning("Passwords do not match");
                return;
            }
    
            // Signup API call
            try {
                const response = await axios.post('http://localhost:5000/api/user/register', {
                    firstname: inputValues.fname,
                    lastname: inputValues.lname,
                    email: inputValues.email,
                    password: inputValues.password,
                    mobile: inputValues.mobile
                });
    
                if (response.status === 200) {
                    const userData = response.data;
                    toast.success("Signup Successfully");
    
                    setSignupEmail(inputValues.email);
                    setSignupPassword(inputValues.password);
    
                    // Store user details in session storage
                    sessionStorage.setItem('userDetails', JSON.stringify(userData));
    
                    setIsSignupVisible(false); // Switch to login form
                    setIsLoggedIn(true);
                    toggleForm(false);
                    // Reload the page after successful signup
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error('Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error.response ? error.response.data : error.message);
                toast.warning("Signup failed, please try again");
            }
        }
    };
    

    return (
        <>
            {isFormOpen && (
                <div className="backdrop">
                    <div className="modal_centered">
                        <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>

                            {/*===== Form-Header =====*/}
                            <div className="form_head">
                                <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                <p>
                                    {isSignupVisible ? 'Already have an account?' : 'New to E_Com Market Place?'}&nbsp;&nbsp;
                                    <button type="button" onClick={handleIsSignupVisible}>
                                        {isSignupVisible ? 'Login' : 'Create an account'}
                                    </button>
                                </p>
                            </div>

                            {/*===== Form Body - Conditional Rendering for Login and Signup =====*/}
                            {isSignupVisible ? (
                                // Signup Form
                                <>
                                    <div className="form_body">
                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="fname"
                                                className="input_field"
                                                value={inputValues.fname || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">First Name</label>
                                        </div>
                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="lname"
                                                className="input_field"
                                                value={inputValues.lname || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Last Name</label>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="email"
                                                name="email"
                                                className="input_field"
                                                value={inputValues.email || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Email</label>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="mobile"
                                                className="input_field"
                                                value={inputValues.mobile || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Mobile Number</label>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="password"
                                                name="password"
                                                className="input_field"
                                                value={inputValues.password || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Password</label>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="password"
                                                name="conf_password"
                                                className="input_field"
                                                value={inputValues.conf_password || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Confirm Password</label>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn login_btn">Signup</button>
                                </>
                            ) : (
                                // Login Form
                                <>
                                    <div className="form_body">
                                        <div className="input_box">
                                            <input
                                                type="email"
                                                name="mail"
                                                className="input_field"
                                                value={inputValues.mail || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Email</label>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="password"
                                                name="password"
                                                className="input_field"
                                                value={inputValues.password || ''}
                                                onChange={handleInputValues}
                                                required
                                            />
                                            <label className="input_label">Password</label>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn login_btn">Login</button>
                                </>
                            )}

                            {/*===== Form-Close-Btn =====*/}
                            <div
                                className="close_btn"
                                title="Close"
                                onClick={() => toggleForm(false)}
                            >
                                &times;
                            </div>

                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default AccountForm;