import axios from "axios";
import { toast } from "react-toastify";
import { LockClosedIcon } from "@heroicons/react/24/solid";

const ForgotPassword = () => {

    const toastOptions = {
        autoClose: 3000,
        position: "top-right",
        limit: 1,
        newestOnTop: false,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        const data = new FormData(e.currentTarget);
        const userEmail = data.get("email");

        if (!userEmail) {
            toast.error("Email address is required.",toastOptions);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userEmail)) {
            toast.error("Please enter a valid email address.", toastOptions);
            return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotPassword`;

        try {
            const res = await axios.post(url, { userEmail: userEmail });
            if (!res.data.success) {
                toast.error(res.data.message, toastOptions);
            } else {
                toast.success(res.data.message, toastOptions);
            }
        } catch{
            toast.error("An error occurred. Please try again.", toastOptions);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center">
                        <div className="bg-[#1B4237]  rounded-full p-3">
                            <LockClosedIcon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl text-gray-700 font-bold text-center mt-6">Forgot Password</h1>
                    <form onSubmit={handleSubmit} noValidate className="mt-4">
                        <div className="mt-10 mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                autoComplete="email"
                                autoFocus
                                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#1B4237]  text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-300"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
