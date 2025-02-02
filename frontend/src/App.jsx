
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import AreaConverter from './pages/ConverterPage';
import HomeLoanEMICalculator from './pages/EmiCalculater';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PropertyDetails from './pages/Admin/PropertyDetails';
import UserDetails from './pages/Admin/userDetails';
import AdminProfile from './pages/Admin/adminprofile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />}/>
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/home" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={< ForgotPassword/>} />
        <Route path='/reset-password' element={< ResetPassword/>} />
        <Route path='/area-converter' element={< AreaConverter/>} />
        <Route path='/emi-calculator' element={< HomeLoanEMICalculator/>} />

        {/* Route path for admin*/}
        <Route path='/admin/dashboard' element={< AdminDashboard/>} />
        <Route path='/admin/properties' element={< PropertyDetails/>} />
        <Route path='/admin/users' element={< UserDetails/>} />
        <Route path='/admin/notifications' element={< AdminProfile/>} />
        <Route path='/admin/profile' element={< AdminProfile/>} />

        <Route element={<PrivateRoute />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}