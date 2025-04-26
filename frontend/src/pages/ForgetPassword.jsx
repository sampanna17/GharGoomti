import axios from "axios";
import { toast , ToastContainer } from "react-toastify";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {


    const navigate = useNavigate();

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
            toast.error("Email address is required.", toastOptions);
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
                // toast.success(res.data.message, toastOptions);
                toast.success(
                    <>
                      <div className="mr-2">A password reset link has been sent to your email.</div>
                      <div className="mr-5">
                        <a 
                          href="https://mail.google.com/mail/u/0/#inbox" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className=" w-auto hover:underline"
                        >
                          <span className="w-auto">Click Here</span>
                        </a>
                      </div>
                    </>,
                    toastOptions
                  );
                                  
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.message === "A password reset link has already been sent. Please check your email.") {
                    toast.info("A password reset link has already been sent. Please check your email.", toastOptions);
                } else {
                    toast.error(error.response.data.message || "An error occurred. Please try again.", toastOptions);
                }
            } else if (error.request) {
                toast.error("Network error. Please try again.", toastOptions);
            } else {
                toast.error("An error occurred", toastOptions);
            }
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const handleBackToSignup = () => {
        navigate("/signup");
    };
    


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
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
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleBackToLogin} // Call the function when clicked
                        className="bg-[#1B4237] mt-4 w-40 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-300"
                    >
                        Back to Login
                    </button>
                    <button
                        type="button"
                        onClick={handleBackToSignup} // Call the function when clicked
                        className="bg-[#1B4237] mt-4 w-40 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-300"
                    >
                        Back to Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
