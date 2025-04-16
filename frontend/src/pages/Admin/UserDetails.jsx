import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Sidebar from "../../components/AdminSideBar";
import Navbar from "../../components/AdminNav";
import PaginationComponent from "../../components/PaginationComponent";
import axios from "axios";
import { toast } from "react-toastify";

const UserDetails = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paginatedUsers, setPaginatedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/admin/");
                console.log("All users response:", response.data);
                setAllUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (allUsers.length > 0) {
            const initialPaginated = allUsers.slice(0, 8);
            setPaginatedUsers(initialPaginated);
        }
    }, [allUsers]);


    const handlePageChange = (newPaginatedItems) => {
        console.log("Paginated users:", newPaginatedItems);
        setPaginatedUsers(newPaginatedItems);
    };

    const handleRowClick = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
            console.log("Single user response:", response.data); // Add this
            setSelectedUser(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Failed to load user details");
        }
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8000/api/admin/${userId}`);
                toast.success("User deleted successfully");
                setAllUsers(prev => prev.filter(user => user.userID !== userId));
                setSelectedUser(null);
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">Loading users...</div>
                    ) : !selectedUser ? (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h1 className="text-2xl font-bold mb-6">User Management</h1>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Role</th>
                                        <th className="p-3 text-left">Registered Date</th>
                                        <th className="p-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr
                                            key={user.userID}
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleRowClick(user.userID)}
                                        >
                                            <td className="p-3">{user.userFirstName} {user.userLastName}</td>
                                            <td className="p-3">{user.userEmail}</td>
                                            <td className="p-3 capitalize">{user.role}</td>
                                            <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td
                                                className="p-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                    onClick={() => handleDeleteUser(user.userID)}
                                                >
                                                    <FaTrash className="mr-1" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <PaginationComponent
                                allItems={allUsers}
                                itemsPerPage={8}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
                                <button
                                    className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
                                    onClick={handleCloseDetails}
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-6">
                                <div className="w-36 h-36 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-gray-200">
                                    {selectedUser.profile_picture ? (
                                        <img
                                            src={selectedUser.profile_picture}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedUser.userFirstName} {selectedUser.userLastName}
                                </h2>
                                <p className="text-gray-500">{selectedUser.role}</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start">
                                    <div className="w-1/3">
                                        <p className="text-gray-500 font-medium">Email</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-800">{selectedUser.userEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-1/3">
                                        <p className="text-gray-500 font-medium">Phone</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-800">{selectedUser.userContact || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-1/3">
                                        <p className="text-gray-500 font-medium">Age</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-800">{selectedUser.userAge || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-1/3">
                                        <p className="text-gray-500 font-medium">Registered at</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-800">
                                            {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                    onClick={() => handleDeleteUser(selectedUser.userID)}
                                >
                                    <FaTrash className="mr-2" />
                                    Delete User
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;