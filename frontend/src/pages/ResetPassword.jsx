import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { toast } from "react-toastify";
import { useState } from "react";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("id");
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(false); 

    const toastOptions = {
        autoClose: 3000,
        position: "top-right",
        limit: 1,
        newestOnTop: false,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        setIsLoading(true);

        const data = new FormData(e.currentTarget);
        const newPassword = data.get("newpassword");
        const confirmPassword = data.get("confirmpassword");

        if (!newPassword && !confirmPassword) {
            toast.error("Please Enter the New Password and Confirm Password", toastOptions);
            setIsLoading(false); 
            return;
        }

        if (!confirmPassword) {
            toast.error("Please Enter Confirm Password", toastOptions);
            setIsLoading(false); 
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long", toastOptions);
            setIsLoading(false); 
            return false;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match!", toastOptions);
            setIsLoading(false); 
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
                toast.success(res.data.message, toastOptions);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast.error(res.data.message, toastOptions);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("An error occurred. Please try again.", {
                autoClose: 5000,
                position: "top-right",
            });
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center">
                        <div className="bg-[#1B4237] rounded-full p-3">
                            <LockClosedIcon className="h-6 w-6 text-white" /> {/* Icon */}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mt-4">
                        Reset Password
                    </h1>
                    <form onSubmit={handleSubmit} noValidate className="mt-4">
                        <div className="mt-8 mb-4">
                            <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newpassword"
                                name="newpassword"
                                required
                                autoFocus
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button when loading
                            className="w-full bg-[#1B4237] text-white py-2 px-4 rounded-sm hover:bg-gray-500 transition duration-300 "
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