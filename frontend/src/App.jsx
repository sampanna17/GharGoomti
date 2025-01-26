
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import AreaConverter from './pages/ConverterPage';
import HomeLoanEMICalculator from './pages/EmiCalculater';

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
        <Route element={<PrivateRoute />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}