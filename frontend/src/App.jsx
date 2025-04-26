// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Home from './pages/Home';
// import EmailVerificationPage from './pages/EmailVerificationPage';
// import ForgotPassword from './pages/ForgetPassword';
// import ResetPassword from './pages/ResetPassword';
// import AreaConverter from './pages/ConverterPage';
// import HomeLoanEMICalculator from './pages/EmiCalculater';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import PropertyDetails from './pages/Admin/PropertyDetails';
// import UserDetails from './pages/Admin/userDetails';
// import AdminProfile from './pages/Admin/adminprofile';
// import Layout from "./components/Layout";
// import BookmarkPage from './pages/BookmarkPage';
// import Chats from './pages/ChatPgae';
// import AddProperty from './pages/Addproperty';
// import ScrollToTop from './components/ScrollToTop';
// import SinglePage from './pages/singlePage/SinglePage';
// import ListPage from './pages/ListProperty/ListProperty';
// import UserProfile from './pages/UserProfile';
// import AdminNotification from './pages/Admin/Notification';
// import { UserProvider } from "./context/UserContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <UserProvider>
//       <BrowserRouter>
//         <ScrollToTop />
//         <Routes>
//           {/* Auth Routes */}
//           <Route path="/" element={<Navigate to="/home" />} />
//           <Route path="/verify-email" element={<EmailVerificationPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />

//           {/* Routes wrapped in Layout */}
//           <Route element={<Layout />}>
//             <Route path="/home" element={<Home />} />
//             <Route path="/area-converter" element={<AreaConverter />} />
//             <Route path="/emi-calculator" element={<HomeLoanEMICalculator />} />
//             <Route path="/bookmarks" element={<BookmarkPage />} />
//             <Route path="/chats" element={<Chats />} />
//             <Route path="/properties" element={<ListPage />} />
//             <Route path="/add-property" element={<AddProperty />} />
//             <Route path="/add-property/:propertyID" element={<AddProperty />} />
//             <Route path="/:id" element={<SinglePage />} />
//             <Route path="/single-page" element={<SinglePage />} />
//             <Route path="/profile" element={<UserProfile />} />
//           </Route>

//           {/* Admin Routes */}

//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/properties" element={<PropertyDetails />} />
//           <Route path="/admin/users" element={<UserDetails />} />
//           <Route path="/admin/notifications" element={<AdminNotification />} />
//           <Route path="/admin/profile" element={<AdminProfile />} />

//         </Routes>
//       </BrowserRouter>
//     </UserProvider>
//   );
// }


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
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
import Layout from "./components/Layout";
import BookmarkPage from './pages/BookmarkPage';
import Chats from './pages/ChatPgae';
import AddProperty from './pages/Addproperty';
import ScrollToTop from './components/ScrollToTop';
import SinglePage from './pages/singlePage/SinglePage';
import ListPage from './pages/ListProperty/ListProperty';
import UserProfile from './pages/UserProfile';
import AdminNotification from './pages/Admin/Notification';
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from './components/RoleBasedRedirect';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* Auth Routes */}
          {/* <Route path="/" element={<Navigate to="/home" />} /> */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/area-converter" element={<AreaConverter />} />
            <Route path="/emi-calculator" element={<HomeLoanEMICalculator />} />
            <Route path="/bookmarks" element={<BookmarkPage />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/properties" element={<ListPage />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/add-property/:propertyID" element={<AddProperty />} />
            <Route path="/:id" element={<SinglePage />} />
            <Route path="/single-page" element={<SinglePage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Admin Routes Protected */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/properties" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PropertyDetails />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserDetails />
            </ProtectedRoute>
          } />

          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminNotification />
            </ProtectedRoute>
          } />

          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
