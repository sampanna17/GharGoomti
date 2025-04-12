    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import Cookies from 'js-cookie';
    import Logo from "../assets/LOGO.png";
    import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
    import { RiTwitterXFill } from "react-icons/ri";
    import HoverArrowText from './HoverArrowText';
    import { toast, ToastContainer } from 'react-toastify';

    const Footer = () => {
        const [email, setEmail] = useState('');
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [userId, setUserId] = useState(null);
        const [isSubscribed, setIsSubscribed] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [isUnsubscribing, setIsUnsubscribing] = useState(false);

        const getUserData = () => {
            try {
                const userData = Cookies.get("user_data");
                return userData ? JSON.parse(userData) : null;
            } catch (e) {
                console.error("Error parsing user data:", e);
                return null;
            }
        };

        useEffect(() => {
            const userData = getUserData();
            if (userData) {
                setIsLoggedIn(true);
                setUserId(userData.userID);
                setEmail(userData.userEmail || '');
                checkSubscriptionStatus(userData.userID);
            }
        }, []);

        const checkSubscriptionStatus = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userId}/subscription-status`);
                setIsSubscribed(response.data.isSubscribed);
            } catch (error) {
                console.error("Error checking subscription status:", error);
                toast.error("Failed to check subscription status");
            }
        };

        const handleSubscribe = async () => {
            if (!isLoggedIn) {
                toast.error("Please login to subscribe");
                return;
            }

            const userData = getUserData();

            if (!email) {
                toast.error("Email is required");
                return;
            }

            if (!validateEmail(email)) {
                toast.error("Please enter a valid email address");
                return;
            }

            if (userData.userEmail && email !== userData.userEmail) {
                toast.error("Please use your registered email address");
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.put(`http://localhost:8000/api/user/${userId}/subscribe`);
                setIsSubscribed(true);
                toast.success(response.data.message || "Successfully subscribed to property notifications");
            } catch (error) {
                console.error("Subscription error:", error);
                const errorMessage = error.response?.data?.error || "Failed to subscribe. Please try again.";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        const handleUnsubscribe = async () => {
            if (!isLoggedIn || !isSubscribed) return;

            setIsUnsubscribing(true);
            try {
                const response = await axios.put(`http://localhost:8000/api/user/${userId}/unsubscribe`);
                setIsSubscribed(false);
                toast.success(response.data.message || "Successfully unsubscribed from property notifications");
            } catch (error) {
                console.error("Unsubscription error:", error);
                const errorMessage = error.response?.data?.error || "Failed to unsubscribe. Please try again.";
                toast.error(errorMessage);
            } finally {
                setIsUnsubscribing(false);
            }
        };

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        const handleEmailChange = (e) => {
            setEmail(e.target.value);
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                if (isSubscribed) {
                    handleUnsubscribe();
                } else {
                    handleSubscribe();
                }
            }
        };

        const handleSubscriptionToggle = () => {
            if (isSubscribed) {
                handleUnsubscribe();
            } else {
                handleSubscribe();
            }
        };

        return (

            <div className="w-full bg-[#1B4237] flex flex-col items-center justify-center p-6">
                <ToastContainer position="top-right" autoClose={2000} limit={1} newestOnTop={false} closeOnClick />
                <div className="flex flex-col items-center max-w-md w-full mb-8">
                    <div className="mb-6">
                        <img
                            src={Logo}
                            alt="Logo"
                            className="w-40 h-36"
                        />
                    </div>
                    <h1 className="text-white text-3xl font-semibold mb-4 text-center">
                        Stay Up to Date
                    </h1>
                    <p className="text-white/80 text-center text-sm mb-8">
                        {isLoggedIn && isSubscribed
                            ? "You're subscribed to property notifications"
                            : "Subscribe to receive updates on new properties"}
                    </p>
                    <div className="w-full mb-16">
                        <div className="flex items-center bg-[#2A5147] rounded-lg">
                            <input
                                type="email"
                                placeholder={isLoggedIn ? email || "Your e-mail" : "Login to subscribe"}
                                value={email}
                                onChange={handleEmailChange}
                                onKeyPress={handleKeyPress}
                                className="w-full text-white px-4 py-3 bg-[#2A5147] rounded-lg focus:outline-none"
                                disabled={!isLoggedIn || isSubscribed}
                            />
                            <button
                                onClick={handleSubscriptionToggle}
                                disabled={!isLoggedIn || isLoading || isUnsubscribing}
                                className={`text-white opacity-80 px-4 py-3 rounded-r-lg flex items-center hover:opacity-100 transition-opacity ${!isLoggedIn ? 'cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                            >
                                {isLoading ? (
                                    'Processing...'
                                ) : isUnsubscribing ? (
                                    'Unsubscribing...'
                                ) : isSubscribed ? (
                                    <HoverArrowText
                                        text="Unsubscribe"
                                        Iconstart={null}
                                        customClass="flex items-center"
                                    />
                                ) : (
                                    <HoverArrowText
                                        text="Subscribe"
                                        Iconstart={null}
                                        customClass="flex items-center"
                                    />
                                )}
                            </button>
                        </div>
                        {!isLoggedIn && (
                            <p className="text-white/60 text-xs mt-2 text-center">
                                Please login to subscribe to notifications
                            </p>
                        )}
                        {isLoggedIn && isSubscribed && (
                            <p className="text-white/60 text-xs mt-2 text-center">
                                Click unsubscribe to stop receiving notifications
                            </p>
                        )}
                    </div>

                    <div className="w-full pt-8 border-t border-white/20">
                        <div className="flex justify-between items-center">
                            <p className="text-white/60 text-sm">
                                Copyright © 2025 Ghar Goomti
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.facebook.com/sampanna.piya/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <FaFacebookF className="w-5 h-5" />
                                </a>
                                <button
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <RiTwitterXFill className="w-5 h-5" />
                                </button>
                                <a
                                    href="https://www.instagram.com/sampanna_piya/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/sampanna-piya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <FaLinkedinIn className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default Footer;