
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SocketContextProvider } from './context/SocketContext.jsx';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
        <UserProvider>
          <SocketContextProvider>
            <ToastContainer />
            <App />
          </SocketContextProvider>
        </UserProvider>
      </AuthProvider>
    </PersistGate>
  </Provider>
);