import Sidebar from "../../components/AdminSideBar.jsx";
import Navbar from "../../components/AdminNav.jsx";
import StatsCard from "../../components/AdminStatsCard.jsx";
import PropertyTable from "../../components/AdminPropertyTable.jsx";

const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard title="Total Properties" value="" icon="🏠" />
            <StatsCard title="Total Users" value="" icon="👤" />
            <StatsCard title="Total Revenue" value="" icon="💰" />
          </div>

          {/* Property Table */}
          <PropertyTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;