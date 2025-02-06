import { Heart, ChevronDown, MessageSquareMore, CircleUser } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import HoverArrowText from '../components/HoverArrowText';

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
  const navigateToChats = () => navigate('/chats');
  const navigateToProfile = () => navigate('/profile');
  const navigateToHome = () => navigate('/');
  const navigateToProperties = () => navigate('/properties');
  const navigateToAddProperty = () => navigate('/add-property');

  return (
    <>
      <nav className="w-full px-20 py-6 border-b flex items-center justify-between bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-14 h-12 text-blue-600" />
          <span className="text-lg font-semibold pt-4">Ghar Goomti</span>
        </div>
        <div className="hidden md:flex items-center gap-6 pt-4">
          <span
            onClick={navigateToHome}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          >
            Home
          </span>
          <span
            onClick={navigateToProperties}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          >
            Properties
          </span>
          <span
            onClick={navigateToAddProperty} 
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          >
            Sell/Rent
          </span>
          <div className="relative">
            <span
              onClick={toggleDropdown}
              className="cursor-pointer text-gray-600 hover:text-blue-600 flex items-center gap-2"
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

          <div className="relative group">
            <Heart
              className="w-5 h-5 text-gray-600 cursor-pointer transition-all duration-300 group-hover:fill-red-800 group-hover:stroke-red-800"
              strokeWidth={2}
              onClick={navigateToBookmarks} // Navigate to /bookmarks on click
            />
          </div>
          <MessageSquareMore
            className="w-5 h-5 text-gray-600 cursor-pointer"
            onClick={navigateToChats} // Navigate to /chats on click
          />
          <CircleUser
            className="w-6 h-6 text-gray-600 cursor-pointer"
            onClick={navigateToProfile} // Navigate to /profile on click
          />
        </div>
      </nav>
      <div className="mt-20 fixed top-4 left-0 right-0 z-10 bg-white h-3"></div>
    </>
  );
};
