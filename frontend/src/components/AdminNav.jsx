import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, setIsLoggedIn , refreshUserData } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return null; 
  }

  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/signout', {}, { withCredentials: true });
      Cookies.remove('user_data');
      localStorage.removeItem('user');
      refreshUserData();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        Welcome, {user?.userFirstName} {user?.userLastName}
      </h2>
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button
          onClick={handleNotificationClick}
          className="relative text-gray-500 hover:text-blue-800"
        >
          <FaBell size={24} />
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;


