import { useState } from "react";
import Logo from "../assets/LOGO.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../css/SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


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
  const [successMessage, setSuccessMessage] = useState(""); // State for the success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
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
              <input
                type="tel"
                name="userContact"
                placeholder="Phone Number"
                value={formData.userContact}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="userAge"
                placeholder="Age"
                value={formData.userAge}
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                ) : (
                  <FaEye
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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
                <button type="button">
                  <img src={GoogleSvg} alt="" />
                  Sign Up with Google
                </button>
              </div>
            </form>

            {/* Show success message*/}
            {successMessage && (
              <div className="signup-success-message">{successMessage}</div>
            )}
          </div>

          <p className="signup-bottom-p">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;