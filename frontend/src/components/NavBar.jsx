import { Heart, ChevronDown, MessageSquareMore, CircleUser } from "lucide-react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import HoverArrowText from '../components/HoverArrowText';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from '../context/UserContext';

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigateToAreaConverter = () => {
    navigate('/area-converter');
    setDropdownOpen(false);
  };

  const navigateToEMICalculator = () => {
    navigate('/emi-calculator');
    setDropdownOpen(false);
  };

  const navigateToBookmarks = () => navigate('/bookmarks');
  // const navigateToChats = () => navigate('/chats');
  const navigateToHome = () => navigate('/');
  const navigateToProperties = () => navigate('/properties');
  const navigateToAddProperty = () => navigate('/add-property');

  const handleChatClick = () => {
    if (!isLoggedIn) {
      toast.error('You are not logged in. Please login to access chat.'
      );
    } else {
      navigate('/chats');
    }
  };

  return (
    <>
       <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
      <nav className="w-full px-20 py-6 border-b flex items-center justify-between bg-white fixed top-0 left-0 right-0 z-50">
       
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-14 h-12 text-blue-600" />
          <span className="text-lg font-semibold pt-4">Ghar Goomti</span>
        </div>
        <div className="hidden md:flex items-center gap-6 pt-4">
          <span
            onClick={navigateToHome}
            className="cursor-pointer text-gray-600 hover:text-blue-800"
          >
            Home
          </span>
          <span
            onClick={navigateToProperties}
            className="cursor-pointer text-gray-600 hover:text-blue-800"
          >
            Properties
          </span>
          <span
            onClick={navigateToAddProperty}
            className="cursor-pointer text-gray-600 hover:text-blue-800"
          >
            Sell/Rent
          </span>
          <div className="relative">
            <span
              onClick={toggleDropdown}
              className="cursor-pointer text-gray-600 hover:text-blue-800 flex items-center gap-2"
            >
              Tools <ChevronDown className="w-4 h-4 text-gray-600" />
            </span>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 ">
                <span
                  onClick={navigateToEMICalculator}
                  className="block cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 group"
                >
                  <HoverArrowText
                    text="EMI Calculator"
                    IconEnd={null}
                    customClass="-ml-2"
                  />
                </span>
                <span
                  onClick={navigateToAreaConverter}
                  className="block cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 group"
                >
                  <HoverArrowText
                    text="Area Converter"
                    IconEnd={null}
                    customClass="-ml-2"
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4">

          <div className="relative">
            <Heart
              className="w-5 h-5 text-gray-600 cursor-pointer transition-all duration-500
             hover:fill-red-800 hover:stroke-red-800"
              strokeWidth={2}
              fill="transparent"
              onClick={navigateToBookmarks}
            />

          </div>
          <MessageSquareMore
            className="w-5 h-5 text-gray-600 cursor-pointer"
            onClick={handleChatClick}
          />

          <div className="relative">
            {/* Only the icon should trigger the dropdown */}
            <div className="inline-block hover:bg-gray-100 rounded-full p-1">
              <CircleUser
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onClick={() => {
                  navigate('/profile', { state: { activeTab: 'user' } });
                  setProfileDropdownOpen(false);
                }}

              />
            </div>

            {/* Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    navigate('/profile', { state: { activeTab: 'user' } });
                    setProfileDropdownOpen(false);
                  }}
                  className="group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HoverArrowText
                    text="Profile"
                    IconEnd={null}
                    customClass="group-hover:translate-x-1 transition-transform duration-200 -ml-2"
                  />
                </button>

                <button
                  onClick={() => {
                    navigate('/profile', { state: { activeTab: 'listing' } });
                    setProfileDropdownOpen(false);
                  }}
                  className="group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HoverArrowText
                    text="Listing"
                    IconEnd={null}
                    customClass="group-hover:translate-x-1 transition-transform duration-200 -ml-2"
                  />
                </button>

                <button
                  onClick={() => {
                    navigate('/profile', { state: { activeTab: 'appointments' } });
                    setProfileDropdownOpen(false);
                  }}
                  className="group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HoverArrowText
                    text="Appointment"
                    IconEnd={null}
                    customClass="group-hover:translate-x-1 transition-transform duration-200 -ml-2"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="mt-20 fixed top-4 left-0 right-0 z-10 bg-white h-3"></div>
    </>
  );
};
