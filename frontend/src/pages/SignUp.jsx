import { useState, useRef } from "react";
import Logo from "../assets/LOGO.png";
import { FaEye, FaEyeSlash, FaRegUser  } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../css/SignUp.css";

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    userFirstName: "",
    userLastName: "",
    userContact: "",
    userEmail: "",
    userAge: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          profileImage: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      profileImage: null
    });
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Validate form data
  const validateForm = () => {
    const {
      userFirstName,
      userLastName,
      userContact,
      userEmail,
      userAge,
      password,
      confirmPassword,
    } = formData;

    if (
      !userFirstName ||
      !userLastName ||
      !userContact ||
      !userEmail ||
      !userAge ||
      !password ||
      !confirmPassword
    ) {
      return "All fields are required.";
    }

    if (
      !/^[a-zA-Z\s]+$/.test(userFirstName) ||
      !/^[a-zA-Z\s]+$/.test(userLastName)
    ) {
      return "First and Last Name must contain only letters.";
    }

    if (!/^[0-9]{10}$/.test(userContact)) {
      return "Phone Number must be a valid 10-digit number.";
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)) {
      return "Please enter a valid email address.";
    }

    if (!/^[0-9]{1,3}$/.test(userAge) || userAge < 1 || userAge > 100) {
      return "Age must be a valid number between 1 and 100.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!isChecked) {
      return "You must agree to the terms and conditions.";
    }

    return null; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userFirstName: formData.userFirstName,
          userLastName: formData.userLastName,
          userContact: formData.userContact,
          userEmail: formData.userEmail,
          userAge: formData.userAge,
          password: formData.password,
          role: "Buyer", // Default role
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate("/verify-email", { state: { userEmail: formData.userEmail } }), 1000);
      } else {
        toast.error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-main">
      <ToastContainer position="bottom-center" autoClose={3000} limit={1}
        newestOnTop={false}
        closeOnClick />
      <div className="signup-left">
        <div className="signup-logo">
          <img src={Logo} alt="logo" className="signup-logo-image" />
        </div>
      </div>
      <div className="signup-right">
        <div className="">
          <div className="signup-center">
            <h2>Create your Ghar Goomti account!</h2>
            <p>Please enter your details to sign up</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col items-center relative -mt-4 -mb-5">
                <div
                  className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors relative"
                  onClick={triggerFileInput}
                >
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" /> 
                    </>
                  ) : (
                    <div className="">
                      <FaRegUser  className="text-gray-500 text-4xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-gray-600 text-sm mt-2 cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                removeImage(); 
              }}>
                  {previewImage ? "Remove Picture" : "Add profile picture"}
                </p>
              </div>
              <div className="signup-name-fields">
                <input
                  type="text"
                  name="userFirstName"
                  placeholder="First Name"
                  value={formData.userFirstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="userLastName"
                  placeholder="Last Name"
                  value={formData.userLastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="signup-name-fields">
                <input
                  type="tel"
                  name="userContact"
                  placeholder="Phone Number"
                  value={formData.userContact}
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, userContact: inputValue });
                  }}
                  required
                  pattern="[0-9]{10}"
                  title="Phone number"
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />

                <input
                  type="text"
                  name="userAge"
                  placeholder="Age"
                  value={formData.userAge}
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric characters
                    setFormData({ ...formData, userAge: inputValue });
                  }}
                  required
                  pattern="[0-9]*"
                  title="Please enter a valid age"
                />
              </div>

              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
              <div className="signup-pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="signup-pass-input-div">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {showConfirmPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </div>

              <div className="signup-center-options">
                <div className="signup-remember-div">
                  <input type="checkbox" id="terms-checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                  <label htmlFor="terms-checkbox">
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>
              <div className="signup-center-buttons">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>

          <p className="signup-bottom-p ">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
