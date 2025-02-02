import { Heart, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Logo from "../assets/LOGO.png";
import HoverArrowText from '../components/HoverArrowText';

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Navigate to Area Converter
  const navigateToAreaConverter = () => {
    navigate('/area-converter');
    setDropdownOpen(false);
  };

  // Navigate to EMI Calculator
  const navigateToEMICalculator = () => {
    navigate('/emi-calculator');
    setDropdownOpen(false); // Close the dropdown after navigation
  };

  // Navigate to Home
  const navigateToHome = () => navigate('/');

  // Navigate to Properties
  const navigateToProperties = () => navigate('/properties');

  // Navigate to Sell/Rent
  const navigateToSellRent = () => navigate('/sell-rent');

  return (
    <nav className="w-full px-20 py-6 mb-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        <img src={Logo} alt="logo" className="w-12 h-12 text-blue-600" />
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
          onClick={navigateToSellRent}
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
        <Heart className="w-5 h-5 text-gray-600" />
        <User className="w-6 h-6 text-gray-600" />
      </div>
    </nav>
  );
};
