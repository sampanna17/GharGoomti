import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "../components/Card/card";
import { FaEdit, FaTrash } from "react-icons/fa";
import AppointmentsTab from "../components/appointmentTab";


const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);


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

  const userData = Cookies.get("user_data");
  let userId = null;

  try {
    const parsed = JSON.parse(userData);
    userId = parsed?.userID;
  } catch (e) {
    console.error("Invalid cookie data", e);
  }


  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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

  useEffect(() => {
    if (activeTab === 'listing') {
      fetchUserProperties();
    }
  }, [activeTab]);

  const fetchUserProperties = async () => {
    const userData = Cookies.get("user_data");
    if (!userData) return;

    try {
      setLoading(true);
      const parsed = JSON.parse(userData);
      const userId = parsed?.userID;

      const response = await axios.get(`http://localhost:8000/api/user/${userId}/properties`);

      if (response.data.success) {
        setProperties(response.data.properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`http://localhost:8000/api/property/${propertyId}`);
        // Refresh the properties list
        fetchUserProperties();
      } catch (err) {
        console.error("Error deleting property:", err);
        alert("Failed to delete property. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/signout', {}, { withCredentials: true });
      Cookies.remove('user_data');
      localStorage.removeItem('user');
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

  useEffect(() => {
    const stateTab = location.state?.activeTab;

    // Get from query if no state
    const queryParams = new URLSearchParams(location.search);
    const queryTab = queryParams.get('activeTab');

    // Prioritize state over query
    if (stateTab) {
      setActiveTab(stateTab);
    } else if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [location]);

  return (
    <div className="mt-28">
      <div className="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-md mb-4">
        {/* Header with Date and Page */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-500 font-medium">
            {isLoggedIn ? (
              <>
                <p>User</p>
                <span className="text-gray-700 font-semibold">
                  {user.userFirstName} {user.userLastName}
                </span>
              </>
            ) : (
              <p>Guest User</p>
            )}
          </div>
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
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Tab Buttons */}
          <div className="flex flex-row space-x-4 border-b border-gray-200 pb-4 justify-around">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-5 py-2 text-lg font-semibold rounded-lg transition-colors ${activeTab === 'user'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              User Details
            </button>
            <button
              onClick={() => setActiveTab('listing')}
              className={`px-5 py-2 text-lg font-semibold rounded-lg transition-colors ${activeTab === 'listing'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-5 py-2 text-lg font-semibold rounded-lg transition-colors ${activeTab === 'appointments'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              Appointments
            </button>
          </div>

          {/* Tab Content */}
          <div className="border-b border-gray-200 pb-4">
            {activeTab === 'user' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-6">
                  {/* Grid layout for form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(user).map((key) => (
                      <div className="space-y-2" key={key}>
                        <label className="block text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </label>
                        <input
                          type={key === "userAge" ? "number" :
                            key === "userEmail" ? "email" : "text"}
                          name={key}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition duration-150"
                          value={user[key]}
                          onChange={handleUserChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 transition-colors duration-200 shadow-sm
                min-w-[200px] text-center"
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                      {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listing' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
                  <button
                    onClick={() => navigate("/add-property")}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Add New Property
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading your properties...</p>
                  </div>
                )}


                {!loading && properties.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You haven't listed any properties yet.</p>
                    <button
                      onClick={() => navigate("/add-property")}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      List Your First Property
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <div key={property.propertyID} className="relative group">
                      <Card
                        item={{
                          ...property,
                          images: property.images.map(url => ({ imageURL: url }))
                        }}
                        showActions={false}
                      />
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/add-property/${property.propertyID}`)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <FaEdit className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.propertyID)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-red-100 transition"
                          title="Delete"
                        >
                          <FaTrash className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {user.role === 'buyer' ? 'Your Appointments' : 'Property Viewings'}
                </h2>
                <AppointmentsTab
                  userID={userId}
                  role={user.role}
                  userFirstName={user.userFirstName}
                  userLastName={user.userLastName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;