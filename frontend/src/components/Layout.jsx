import { Outlet } from "react-router-dom";
import { Navbar } from './NavBar';
import Footer from "./Footer";
import GotoTop from "./GoToTop";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> 
        <GotoTop/>

      </main>
      <Footer />
    </div>
  );
};

export default Layout;
