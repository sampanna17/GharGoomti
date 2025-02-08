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
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/signin",
        { userEmail: email, password, rememberMe }, 
        { withCredentials: true } 
      );

      const { user } = res.data;

      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true"); 

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Unable to log in. Please try again.");
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
            <h2>Welcome back to Ghar Gomti!</h2>
            <p>Please enter your details</p>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input
                    type="checkbox"
                    id="remember-checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
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
