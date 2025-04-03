import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const UserProfile = () => {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [user, setUser] = useState({
    userFirstName: "",
    userLastName: "",
    userContact: "",
    userEmail: "",
    userAge: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.id; 
        if (!userId) return;
        
        const response = await axios.get(`http://localhost:8000/api/auth/users/${userId}`);
        
        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.error("Error fetching user profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8000/api/auth/users/update', user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Error updating profile: " + response.data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("isLoggedIn from localStorage on mount:", loggedIn);
    setIsLoggedIn(loggedIn);

    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  console.log("isLoggedIn state:", isLoggedIn);

  const [appointments, setAppointments] = useState([
    {},
  ]);
  const [listings, setListings] = useState([
    {  },
  ]);

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((appt) => appt.id !== id));
  };

  const deleteListing = (id) => {
    setListings(listings.filter((listing) => listing.id !== id));
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
      <main className="flex-grow flex items-center justify-center mt-10">
          <div className="text-center">
            {/* Displaying login status */}
            <h2 className="text-2xl font-semibold">
              {isLoggedIn ? "You are logged in!" : "You are not logged in."}
            </h2>
          </div>
        </main>

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
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Right Side - Appointments & Listings */}
          <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Appointments</h3>
            {appointments.length > 0 ? (
              <ul className="space-y-2">
                {appointments.map((appt) => (
                  <li key={appt.id} className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="block font-medium">{appt.date}</span>
                      <span className="text-gray-600">{appt.property}</span>
                    </div>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      onClick={() => deleteAppointment(appt.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No visit booked</p>
            )}

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Your Listings</h3>
            {listings.length > 0 ? (
              <ul className="space-y-2">
                {listings.map((listing) => (
                  <li key={listing.id} className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center">
                    <span>{listing.title}</span>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      onClick={() => deleteListing(listing.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No properties listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;