import Logo from "../assets/LOGO.png";
import { FaArrowRight, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="w-full bg-[#1B4237] flex flex-col items-center justify-center p-6">
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
                <p className="text-white/80 text-center text-sm  mb-8">
                    Subscribe to our newsletter to receive our weekly update.
                </p>
                <div className="w-full mb-16">
                    <div className="flex items-center bg-[#2A5147] rounded-lg">
                        <input
                            type="email"
                            placeholder="Your e-mail"
                            className="w-full text-white px-4 py-3 bg-[#2A5147] rounded-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="text-white px-4 py-3 rounded-r-lg flex items-center hover:opacity-80 transition-opacity"
                        >
                            Send
                            <FaArrowRight className="ml-2 w-5 h-4" />
                        </button>
                    </div>
                </div>

                <div className="w-full pt-8 border-t border-white/20">
                    <div className="flex justify-between items-center">
                        <p className="text-white/60 text-sm">
                            Copyright © 2024 Ghar Goomti
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
                                <FaTwitter className="w-5 h-5" />
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
