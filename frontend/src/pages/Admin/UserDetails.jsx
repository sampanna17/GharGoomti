import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/AdminNav";
import PaginationComponent from "../../components/PaginationComponent";

const UserDetails = () => {
    const allUsers = [
    ];

    const [selectedUser, setSelectedUser] = useState(null);

    const [paginatedUsers, setPaginatedProperties] = useState(allUsers.slice(0, 8));

    const handlePageChange = (newPaginatedItems) => {
        setPaginatedProperties(newPaginatedItems);  // Update the paginated properties in the state
    };


    const handleRowClick = (user) => {
        setSelectedUser(user);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
    };

    const handleEditUser = (user) => {
        alert(`Edit User: ${user.name}`);
    };

    const handleDeleteUser = (user) => {
        alert(`Delete User: ${user.name}`);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6 bg-gray-100">
                    {/* User List */}
                    {!selectedUser ? (
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
                                            key={user.id}
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleRowClick(user)}
                                        >
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.role}</td>
                                            <td className="p-3">{user.registeredDate}</td>
                                            <td
                                                className="p-3 flex space-x-2 items-center"
                                                onClick={(e) => e.stopPropagation()} // Prevents row click
                                            >
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    <FaEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    <FaTrash className="mr-1" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        {/* Reusable Pagination Component */}
                        <PaginationComponent
                            allItems={allUsers}
                            itemsPerPage={8}
                            onPageChange={handlePageChange}
                        />
                        </div>
                    ) : (
                        // User Details View
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">User Details</h1>
                                <button
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                    onClick={handleCloseDetails}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="space-y-4">
                                <p>
                                    <strong>Name:</strong> {selectedUser.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {selectedUser.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {selectedUser.phone}
                                </p>
                                <p>
                                    <strong>Role:</strong> {selectedUser.role}
                                </p>
                                <p>
                                    <strong>Address:</strong> {selectedUser.address}
                                </p>
                                <p>
                                    <strong>Registered Date:</strong> {selectedUser.registeredDate}
                                </p>
                            </div>
                            <div className="mt-6 flex space-x-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => handleEditUser(selectedUser)}
                                >
                                    <FaEdit className="mr-1 inline" /> Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    onClick={() => handleDeleteUser(selectedUser)}
                                >
                                    <FaTrash className="mr-1 inline" /> Delete
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