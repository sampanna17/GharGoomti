import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  console.log("isLoggedIn state:", isLoggedIn); // Debugging statement

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Navigation Bar */}
      <header className="bg-blue-600 w-full py-4 shadow-md">
        <div className="max-w-7xl mx-auto text-white flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome to My Website</h1>
          <nav>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-white px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          {/* Displaying login status */}
          <h2 className="text-2xl font-semibold mb-4">
            {isLoggedIn ? "You are logged in!" : "You are not logged in."}
          </h2>
          <p className="text-lg mb-6">
            Browse through our platform and start exploring amazing content.
          </p>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8 w-full text-center">
        <p>© 2025 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
}
