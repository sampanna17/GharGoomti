// import Sidebar from "../../components/AdminSideBar.jsx";
// import Navbar from "../../components/AdminNav.jsx";
// import StatsCard from "../../components/AdminStatsCard.jsx";
// import PropertyTable from "../../components/AdminPropertyTable.jsx";
// import subscribedUser from '../../assets/admin/followers.png'
// import house from '../../assets/admin/house.png'
// import users from '../../assets/admin/team.png'

// const AdminDashboard = () => {

//   http://localhost:8000/api/admin/stats
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <Sidebar />



//       {/* Main Content */}
//       <div className="flex-1">
//         <Navbar />
//         <div className="p-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <StatsCard title="Total Properties" value="" icon={house} />
//             <StatsCard title="Total Users" value="" icon={users} />
//             <StatsCard title="Total Subscribed Users" value="" icon={subscribedUser} />
//           </div>

//           {/* Property Table */}
//           <PropertyTable />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../../components/AdminSideBar.jsx";
import Navbar from "../../components/AdminNav.jsx";
import StatsCard from "../../components/AdminStatsCard.jsx";
import PropertyTable from "../../components/AdminPropertyTable.jsx";
import subscribedUser from '../../assets/admin/followers.png';
import house from '../../assets/admin/house.png';
import users from '../../assets/admin/team.png';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalSubscribedUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard 
              title="Total Properties" 
              value={loading ? "Loading..." : stats.totalProperties} 
              icon={house} 
            />
            <StatsCard 
              title="Total Users" 
              value={loading ? "Loading..." : stats.totalUsers} 
              icon={users} 
            />
            <StatsCard 
              title="Total Subscribed Users" 
              value={loading ? "Loading..." : stats.totalSubscribedUsers} 
              icon={subscribedUser} 
            />
          </div>

          {/* Property Table */}
          <PropertyTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;