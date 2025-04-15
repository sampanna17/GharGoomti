
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/AdminNav";
import Sidebar from "../../components/AdminSideBar";
import { CheckCircle, XCircle } from "lucide-react";
import { useNotificationCount } from "../../hooks/useNotificationCount";

const AdminNotification = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setCount } = useNotificationCount();

    const fetchRequests = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/seller/requests");
            setRequests(res.data);
            setCount(res.data.length);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching seller requests:", error);
        }
        finally {
            setLoading(false); 
        }
    }, [setCount]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (userID, status) => {
        try {
            await axios.put("http://localhost:8000/api/seller/update", { userID, status });
            //   setRequests((prev) => prev.filter((req) => req.userID !== userID));
            setRequests(prev => {
                const newRequests = prev.filter(req => req.userID !== userID);
                setCount(newRequests.length);
                return newRequests;
            });
        } catch (error) {
            console.error("Error updating seller request:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                        Seller Requests
                    </h1>

                    {loading ? (
                        <div className="text-gray-600">Loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-gray-500">No pending seller requests.</div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Requested At</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((user) => (
                                        <tr
                                            key={user.userID}
                                            className="border-b hover:bg-gray-50 transition duration-150"
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {user.userFirstName} {user.userLastName}
                                            </td>
                                            <td className="px-6 py-4">{user.userEmail}</td>
                                            <td className="px-6 py-4">{user.userContact}</td>
                                            <td className="px-6 py-4">
                                                {new Date(user.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handleAction(user.userID, "Accepted")}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                >
                                                    <CheckCircle size={18} />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.userID, "Rejected")}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotification;
