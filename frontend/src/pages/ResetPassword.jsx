import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { toast } from "react-toastify";
import { useState } from "react"; // Add useState for loading state

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("id");
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true

        const data = new FormData(e.currentTarget);
        const newPassword = data.get("newpassword");
        const confirmPassword = data.get("confirmpassword");

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match!", {
                autoClose: 5000,
                position: "top-right",
            });
            setIsLoading(false); // Reset loading state
            return;
        }

        try {
            const url = "http://localhost:8000/api/auth/resetPassword";
            const res = await axios.post(url, {
                userID: userId, 
                password: newPassword,
                reset_password_token: token,
            });

            if (res.data.success) {
                toast.success(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast.error(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("An error occurred. Please try again.", {
                autoClose: 5000,
                position: "top-right",
            });
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center">
                        <div className="bg-blue-500 rounded-full p-3">
                            <LockClosedIcon className="h-6 w-6 text-white" /> {/* Icon */}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mt-4">
                        Reset Password
                    </h1>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newpassword"
                                name="newpassword"
                                required
                                autoFocus
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4 mt-8">
                            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmpassword"
                                name="confirmpassword"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button when loading
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                        >
                            {isLoading ? "Resetting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;