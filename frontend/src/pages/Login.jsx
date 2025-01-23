import { useState } from "react";
import axios from "axios";
import Image from "../assets/image.png";
import ImageUP from "../assets/image-up.png";
import Logo from "../assets/LOGO.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email, password }),
      });
  
      // Handle unexpected non-JSON responses gracefully
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }
  
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true"); // Set login state
        document.cookie = `access_token=${data.token}; path=/`;
      
        navigate("/home");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to log in. Please try again later.");
    }
  };
  
  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="image" className="center-image" />
        <img src={ImageUP} alt="image" className="corner-image" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="logo" className="login-logo-image" />
          </div>
          <div className="login-center">
            <h2>Welcome back to Ghar Goomti!</h2>
            <p>Please enter your details</p>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                <Link to="/forgot-password" className="forgot-pass-link">
                  Forgot password?
                </Link>
              </div>
              <div className="login-center-buttons">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Log In
                </button>
                <OAuth />
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
