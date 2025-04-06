import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    userFirstName: "",
    userLastName: "",
    userContact: "",
    userEmail: "",
    userAge: "",
    role: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = Cookies.get("user_data");

      if (!userData) {
        console.warn("No user_data cookie found.");
        return;
      }

      try {
        const parsed = JSON.parse(userData);
        const userId = parsed?.userID;

        if (!userId) {
          console.warn("No user ID in cookie.");
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);

        if (response.status === 200) {
          setUser(response.data);
          setIsLoggedIn(true);
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (err) {
        console.error("Error parsing or fetching user data:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/signout', {}, { withCredentials: true });
      Cookies.remove('user_data');
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8000/api/auth/users/update', user, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="mt-28">
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

      <div className="flex justify-center items-center min-h-screen p-4 -mt-10 mb-0">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-6xl flex flex-col md:flex-row">
          {/* Left Side - User Details */}
          <div className="w-full md:w-1/3 border-r md:pr-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">User Profile</h2>
            <div className="space-y-4">
              {Object.keys(user).map((key) => (
                <div className="flex flex-col" key={key}>
                  <label className="text-gray-600 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type={key === "age" ? "number" : "text"}
                    name={key}
                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={user[key]}
                    onChange={handleUserChange}
                    readOnly={!isEditing}
                  />
                </div>
              ))}
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Right Side - Placeholder for future appointments/listings */}
          <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
            <p className="text-gray-500">Appointments and listings </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
