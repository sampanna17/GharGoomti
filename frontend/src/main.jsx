
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SocketContextProvider } from './context/SocketContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <UserProvider>
      <SocketContextProvider>
        <ToastContainer />
        <App />
      </SocketContextProvider>
    </UserProvider>
  </AuthProvider>
);
