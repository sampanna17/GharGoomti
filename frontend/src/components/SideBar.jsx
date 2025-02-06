import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-16">Admin Dashboard</h1>
      <ul>
        <li className="mb-10">
          <Link to="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link>
        </li>
        <li className="mb-10">
          <Link to="/admin/properties" className="hover:text-gray-400">Properties</Link>
        </li>
        <li className="mb-10">
          <Link to="/admin/users" className="hover:text-gray-400">Users</Link>
        </li>
        <li className="mb-10">
          <Link to="/admin/notifications" className="hover:text-gray-400">Notifications</Link>
        </li>
        <li className="mb-10">
          <Link to="/admin/profile" className="hover:text-gray-400">Admin Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;