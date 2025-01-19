import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />, // Default route (Login page)
  },
  {
    path: '/login',
    element: <Login />, // Login page
  },
  {
    path: '/signup',
    element: <SignUp />, // Signup page
  },
]);

function App() {
  return (
    <RouterProvider router={router}>
      <Outlet /> {/* Renders the matched route */}
    </RouterProvider>
  );
}

export default App;