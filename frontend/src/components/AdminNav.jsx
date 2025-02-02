import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate("/notifications"); // Redirect to the Notifications page
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, Admin</h2>
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg focus:outline-none"
        />

        {/* Notification Icon */}
        <button
          onClick={handleNotificationClick}
          className="relative text-gray-500 hover:text-blue-600"
        >
          <FaBell size={24} />

        </button>

        {/* Logout Button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
