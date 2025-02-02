import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GotoTop from "../components/GoToTop";
import iconBuySell from "../assets/iconBuySell.png";
import iconRent from "../assets/iconRent.png";
import HoverArrowText from '../components/HoverArrowText';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { HeroSection } from "./HeroSection";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  ); // Initialize directly from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Debugging: Check the value of isLoggedIn in localStorage when the component mounts
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("isLoggedIn from localStorage on mount:", loggedIn);
    setIsLoggedIn(loggedIn);

    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Call your backend logout API
      const response = await fetch('http://localhost:8000/api/auth/signout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login"); // Redirect to the landing page after logout
      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  console.log("isLoggedIn state:", isLoggedIn);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center mt-28">
        
        <header className="w-full py-4 shadow-md">
          <div className="max-w-7xl mx-auto text-white flex justify-between items-center">
            <h1 className="text-black text-3xl font-bold">Welcome to Ghar Goomti</h1>
            <nav>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-black px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-black px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center mt-10">
          <div className="text-center">
            {/* Displaying login status */}
            <h2 className="text-2xl font-semibold">
              {isLoggedIn ? "You are logged in!" : "You are not logged in."}
            </h2>
          </div>
        </main>

        <HeroSection />

        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-medium text-gray-900 sm:text-4xl">
                Property Services
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Explore our wide range of property services.
              </p>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                  <img
                    src={iconBuySell}
                    alt="Buy a property"
                    className="w-24 h-24"
                  />
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Buy a property
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    Find your dream home with our extensive listings.
                  </p>
                  <button className="mt-6 border  text-black  px-4 py-2 rounded-full hover:border-gray-400 group">
                    <HoverArrowText
                      text="Buy Property"
                      to="/properties"
                      IconStart={RiArrowRightUpLine}
                      IconEnd={RiArrowRightUpLine}
                      customClass="-ml-2"
                    />
                  </button>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                  <img
                    src={iconBuySell}
                    alt="Sell a property"
                    className="w-24 h-24"
                  />
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Sell a property
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    List your property and reach potential buyers.
                  </p>
                  <button className="mt-6 border  text-black  px-4 py-2 rounded-full hover:border-gray-400 group">
                    <HoverArrowText
                      text="Sell Property"
                      to="/rent-property"
                      IconStart={RiArrowRightUpLine}
                      IconEnd={RiArrowRightUpLine}
                      customClass="-ml-2"
                    />
                  </button>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                  <img
                    src={iconRent}
                    alt="Rent a property"
                    className="w-24 h-24"
                  />
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Rent a property
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    List your property and reach potential buyers.
                  </p>
                  <button className="mt-6 border  text-black  px-4 py-2 rounded-full hover:border-gray-400 group">
                    <HoverArrowText
                      text="Rent Property"
                      to="/rent-property"
                      IconStart={RiArrowRightUpLine}
                      IconEnd={RiArrowRightUpLine}
                      customClass="-ml-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <GotoTop />
    </>
  );
}
