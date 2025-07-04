
import { useState, useEffect, useCallback  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "../components/card/card";
import { FaEdit, FaTrash, FaCamera, FaTimes, FaUser } from "react-icons/fa";
import AppointmentsTab from "../components/AppointmentTab";
import DeleteConfirmationModal from '../components/DeleteConfirmation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('user');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    propertyId: null,
    propertyName: ""
  });

  const [user, setUser] = useState({
    userFirstName: "",
    userLastName: "",
    userContact: "",
    userEmail: "",
    userAge: "",
    role: "",
    profile_picture: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get user ID from cookies
  const getUserData = () => {
    try {
      const userData = Cookies.get("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  };

  const userData = getUserData();
  const userId = userData?.userID;

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
      if (response.status === 200) {
        setUser({
          userFirstName: response.data.userFirstName,
          userLastName: response.data.userLastName,
          userContact: response.data.userContact,
          userEmail: response.data.userEmail,
          userAge: response.data.userAge,
          role: response.data.role,
          profile_picture: response.data.profile_picture
        });
        setImagePreview(response.data.profile_picture || null);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to load profile data");
    }
  }, [userId]);

  // Fetch user properties
  const fetchUserProperties = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/user/${userId}/properties`);
      setProperties(response.data.success ? response.data.properties : []);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Handle tab changes
  useEffect(() => {
    const stateTab = location.state?.activeTab;
    const queryParams = new URLSearchParams(location.search);
    const queryTab = queryParams.get('activeTab');

    if (stateTab) setActiveTab(stateTab);
    else if (queryTab) setActiveTab(queryTab);
  }, [location]);

  // Initial data fetch
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Fetch properties when listing tab is active
  useEffect(() => {
    if (activeTab === 'listing') {
      fetchUserProperties();
    }
  }, [activeTab, fetchUserProperties]);

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Property deletion
  const handleDeleteProperty = (propertyId) => {
    const property = properties.find(p => p.propertyID === propertyId);
    setDeleteModal({
      isOpen: true,
      propertyId,
      propertyName: property?.propertyTitle || "this property"
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/property/${deleteModal.propertyId}`);
      setProperties(properties.filter(p => p.propertyID !== deleteModal.propertyId));
      toast.success("Property deleted successfully");
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Failed to delete property");
    } finally {
      setDeleteModal({ isOpen: false, propertyId: null, propertyName: "" });
    }
  };

  // User profile editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userFirstName', user.userFirstName);
      formData.append('userLastName', user.userLastName);
      formData.append('userContact', user.userContact);
      formData.append('userAge', user.userAge);
  
      // Handle image changes
      if (selectedImage) {
        formData.append('image', selectedImage); 
      } else if (!imagePreview) {
        // removing the image
        formData.append('deleteProfileImage', 'true');
      }
  
      const response = await axios.put(
        `http://localhost:8000/api/user/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.status === 200) {
        setUser(prev => ({
          ...prev,
          userFirstName: response.data.data.updatedFields.userFirstName,
          userLastName: response.data.data.updatedFields.userLastName,
          userContact: response.data.data.updatedFields.userContact,
          userAge: response.data.data.updatedFields.userAge,
          profile_picture: response.data.data.updatedFields.hasProfileImage || null
        }));
        setImagePreview(response.data.data.updatedFields.hasProfileImage || null);
        setSelectedImage(null);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/signout', {}, { withCredentials: true });
      Cookies.remove('user_data');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      // toast.success("Logout Succesfully.");
      // navigate("/login");
      navigate("/login", { state: { logoutSuccess: true } });
      
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 mt-8">
      <ToastContainer position="top-right" autoClose={2000} limit={1} newestOnTop={false} closeOnClick />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isLoggedIn ? `${user.userFirstName} ${user.userLastName}'s Profile` : 'Guest Profile'}
            </h1>
            <p className="text-gray-600">{user.role ? `Role: ${user.role}` : ''}</p>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('user')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'user' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('listing')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'listing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Appointments
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'user' && (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center md:w-1/3">
                  <div className="relative group mb-4">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl font-bold text-gray-600">
                          <FaUser className="w-20 h-20" />
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <label className="cursor-pointer p-2 text-white hover:text-blue-200 transition-colors">
                          <FaCamera className="text-2xl" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                        {imagePreview && (
                          <button
                            onClick={removeImage}
                            className="p-2 text-white hover:text-red-200 transition-colors"
                          >
                            <FaTimes className="text-xl" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-[#2E4156] text-white rounded-lg hover:bg-[#1A2D42] transition-colors flex items-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full justify-center">
                      <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#2E4156] text-white rounded-lg hover:bg-[#1A2D42] transition-colors disabled:opacity-70 flex-1 max-w-xs"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchUserProfile(); // Reset changes
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex-1 max-w-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Information */}
                <div className="md:w-2/3">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['userFirstName', 'userLastName', 'userContact', 'userAge'].map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                        </label>
                        <input
                          type={field === 'userAge' ? 'number' : field === 'userContact' ? 'tel' : 'text'}
                          name={field}
                          value={user[field] || ''}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500' : 'border-transparent bg-gray-50'} transition-all`}
                        />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={user.userEmail}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border border-transparent bg-gray-50"
                      />
                    </div>
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

            {activeTab === 'appointments' && userId && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, propertyId: null, propertyName: "" })}
        onConfirm={confirmDelete}
        propertyName={deleteModal.propertyName}
      />
    </div>
  );
};

export default UserProfile;