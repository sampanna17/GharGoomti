// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { app } from "../firebase.js";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "../redux/userSlice";
// import { useNavigate } from "react-router-dom";
// import GoogleSvg from "../assets/icons8-google.svg";
// import { toast} from "react-toastify";

// export default function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);

//       // Sign in with Google popup
//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch("http://localhost:8000/api/auth/google", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userEmail: result.user.email, 
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("access_token", data.token);
//         localStorage.setItem("user", JSON.stringify(data));

//         dispatch(signInSuccess(data));

//         navigate("/home");
//       } else {
//         console.error("Google Login Error:", data.error);
//         toast.error(data.error || "Failed to log in with Google." );
//       }
//     } catch (error) {
//       console.error("Google sign-in failed:", error);
//       alert("Could not sign in with Google. Please try again later.");
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleClick}
//       type="button"
//       className="bg-[#F0F0F0] flex justify-center items-center gap-2 h-[6vh] hover:bg-[#c4c4c457]"
//     >
//       <img src={GoogleSvg} alt="Google Logo" className="w-[30px]" />
//       Log In with Google
//     </button>
//   );
// }


import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import GoogleSvg from "../assets/icons8-google.svg";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { useContext } from "react";
import { UserContext } from '../context/UserContext.jsx';

export default function OAuth() {
  const navigate = useNavigate();
  const { refreshUserData } = useContext(UserContext);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: result.user.email, 
        }),
        credentials: 'include' // Important for cookies
      });

      const data = await res.json();

      if (res.ok) {
        // Store user details similar to your regular login
        Cookies.set("user_data", JSON.stringify(data.user), { 
          expires: 1, 
          secure: true, 
          sameSite: "Strict" 
        });
        
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");

        refreshUserData();
        
        if (data.user.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
        
        toast.success("Google login successful!");
      } else {
        toast.error(data.error || "Failed to log in with Google.");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Could not sign in with Google. Please try again later.");
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