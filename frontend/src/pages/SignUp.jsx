import { useState } from "react";
import Logo from "../assets/LOGO.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import "../css/SignUp.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userFirstName: "",
    userLastName: "",
    userContact: "",
    userEmail: "",
    userAge: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    if (!/^[0-9]{1,3}$/.test(userAge) || userAge < 1 || userAge > 120) {
      return "Age must be a valid number between 1 and 120.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null; // Validation passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage({ text: errorMessage, type: "error" });
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
        setMessage({
          text: "Signup successful! Redirecting to email verification...",
          type: "success",
        });
        // Pass userEmail as state when navigating
        setTimeout(() => navigate("/verify-email", { state: { userEmail: formData.userEmail } }), 1000);
      } else {
        setMessage({ text: data.message || "Signup failed.", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="signup-main">
      <div className="signup-left">
        <div className="signup-logo">
          <img src={Logo} alt="logo" className="signup-logo-image" />
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-right-container">
          <div className="signup-center">
            <h2>Create your Ghar Goomti account!</h2>
            <p>Please enter your details to sign up</p>
            <form onSubmit={handleSubmit}>
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
                      const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric characters
                      setFormData({ ...formData, userContact: inputValue });
                    }}
                    required
                    pattern="[0-9]{10}" // Ensure only 10 digits
                    title="Phone number"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                
                <input
                  type="text" // Use text instead of number
                  name="userAge"
                  placeholder="Age"
                  value={formData.userAge}
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric characters
                    setFormData({ ...formData, userAge: inputValue });
                  }}
                  required
                  pattern="[0-9]*" // Allow only numeric input
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
                  <input type="checkbox" id="terms-checkbox" required />
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

          <p className="signup-bottom-p">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
      {message.text && (
        <div
          className={`signup-message ${
            message.type === "success" ? "success" : "error"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Signup;
