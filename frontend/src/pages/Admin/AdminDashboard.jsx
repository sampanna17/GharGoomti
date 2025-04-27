import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../../components/AdminSideBar.jsx";
import Navbar from "../../components/AdminNav.jsx";
import StatsCard from "../../components/AdminStatsCard.jsx";
import subscribedUser from '../../assets/admin/followers.png';
import house from '../../assets/admin/house.png';
import users from '../../assets/admin/team.png';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalSubscribedUsers: 0
  });
  const [propertyTypes, setPropertyTypes] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
  const [propertiesOverTime, setPropertiesOverTime] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get('http://localhost:8000/api/admin/stats');
        setStats(statsResponse.data.data);

        const typesResponse = await axios.get('http://localhost:8000/api/admin/property-types');
        setPropertyTypes(typesResponse.data.data);

        const rolesResponse = await axios.get('http://localhost:8000/api/admin/role-count');
        setUserRoles(rolesResponse.data.data);

        const overTimeResponse = await axios.get(`http://localhost:8000/api/admin/property-overtime?range=${timeRange}`);
        setPropertiesOverTime(overTimeResponse.data.data);

        setLoading(false);
        setLoadingCharts(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
        setLoadingCharts(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const propertyTypeChartData = {
    labels: propertyTypes ? Object.keys(propertyTypes) : [],
    datasets: [
      {
        data: propertyTypes ? Object.values(propertyTypes) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userRolesChartData = {
    labels: userRoles ? Object.keys(userRoles).map(role => role.charAt(0).toUpperCase() + role.slice(1)) : [],
    datasets: [
      {
        data: userRoles ? Object.values(userRoles) : [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const propertiesOverTimeData = {
    labels: propertiesOverTime ? propertiesOverTime.map(item => {
      if (timeRange === 'day') {
        return new Date(item.date).toLocaleDateString();
      } else if (timeRange === 'week') {
        return `Week ${item.week}`;
      } else {
        return new Date(0, item.month - 1).toLocaleString('default', { month: 'short' });
      }
    }) : [],
    datasets: [
      {
        label: 'Properties Listed',
        data: propertiesOverTime ? propertiesOverTime.map(item => item.count) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - fixed */}
      <div className="w-64 flex-shrink-0 fixed h-full z-10 bg-white shadow">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar - fixed */}
        <div className="h-16 fixed top-0 w-[calc(100%-16rem)] z-10 bg-white shadow">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              title="Total Properties" 
              value={loading ? "Loading..." : stats.totalProperties.toLocaleString()} 
              icon={house} 
              bgColor="bg-blue-50"
            />
            <StatsCard 
              title="Total Users" 
              value={loading ? "Loading..." : stats.totalUsers.toLocaleString()} 
              icon={users} 
              bgColor="bg-green-50"
            />
            <StatsCard 
              title="Total Subscribed Users" 
              value={loading ? "Loading..." : stats.totalSubscribedUsers.toLocaleString()} 
              icon={subscribedUser} 
              bgColor="bg-purple-50"
            />
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Property Types Pie */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Properties by Type</h2>
              {loadingCharts ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : propertyTypes ? (
                <div className="h-64">
                  <Pie data={propertyTypeChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No property type data available
                </div>
              )}
            </div>

            {/* User Roles Pie */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Users by Role</h2>
              {loadingCharts ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : userRoles ? (
                <div className="h-64">
                  <Pie data={userRolesChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No user role data available
                </div>
              )}
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Properties Listed Over Time</h2>
              <div className="flex space-x-2">
                {['day', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loadingCharts ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : propertiesOverTime ? (
              <div className="h-96">
                <Line data={propertiesOverTimeData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: ${context.raw}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0 }
                    }
                  }
                }} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">
                No property listing data available
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
