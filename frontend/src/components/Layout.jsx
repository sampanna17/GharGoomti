import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from './NavBar';
import Footer from "./Footer";
import GotoTop from "./GoToTop";

const Layout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> 
        <GotoTop/>

      </main>
      {/* <Footer /> */}
      {location.pathname !== "/chats" && <Footer />}
    </div>
  );
};

export default Layout;
