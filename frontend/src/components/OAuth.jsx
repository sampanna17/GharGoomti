import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import GoogleSvg from "../assets/icons8-google.svg";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);

      // Send the user email to the backend for validation and token generation
      const res = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: result.user.email, // Pass the user's email from Google Auth
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage with the token
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("user", JSON.stringify(data)); // Save user details locally

        // Dispatch the action to update the Redux store
        dispatch(signInSuccess(data));

        // Navigate to the homepage
        navigate("/home");
      } else {
        console.error("Google Login Error:", data.error);
        alert(data.error || "Failed to log in with Google.");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Could not sign in with Google. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-[#F0F0F0] flex justify-center items-center gap-2 h-[6vh] hover:bg-[#c4c4c457]"
    >
      <img src={GoogleSvg} alt="Google Logo" className="w-[30px]" />
      Log In with Google
    </button>
  );
}
