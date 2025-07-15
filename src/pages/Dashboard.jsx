import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLogOut, FiSettings, FiHome, FiStar, FiTrendingUp, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { logo } from "../components/Details";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    const savedFavorites = localStorage.getItem('favorites');
    const savedActivity = localStorage.getItem('recentActivity');
    
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedActivity) setRecentActivity(JSON.parse(savedActivity));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Header */}
      <header className="bg-[#1a1a1a] shadow-sm border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
             <Link to="/" className="flex items-center space-x-4">
                     <img src={logo} alt="MovieApp Logo" className="h-12" />
                   </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#a0aec0]">
                <FiUser className="w-4 h-4" />
                <span className="text-sm">{user?.user?.name || user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-[#a0aec0] hover:text-[#ff1744] hover:bg-[#ff1744]/10 rounded-lg transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0ff0fc]/10 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-[#0ff0fc]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.user?.name || user?.name}!
              </h2>
              <p className="text-[#a0aec0] flex items-center gap-2 mt-1">
                <FiMail className="w-4 h-4" />
                {user?.user?.email || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a0aec0]">Watchlist</p>
                <p className="text-2xl font-bold text-[#39ff14]">{watchlist.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#39ff14]/10 rounded-full flex items-center justify-center">
                <FiClock className="w-6 h-6 text-[#39ff14]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a0aec0]">Favorites</p>
                <p className="text-2xl font-bold text-[#ff1744]">{favorites.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#ff1744]/10 rounded-full flex items-center justify-center">
                <FiStar className="w-6 h-6 text-[#ff1744]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a0aec0]">Recent Activity</p>
                <p className="text-2xl font-bold text-[#0ff0fc]">{recentActivity.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#0ff0fc]/10 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-[#0ff0fc]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-3 p-4 bg-[#0ff0fc]/10 hover:bg-[#0ff0fc]/20 rounded-lg transition-colors duration-200"
            >
              <FiStar className="w-5 h-5 text-[#0ff0fc]" />
              <span className="text-sm font-medium">Browse Movies</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-3 p-4 bg-[#ff1744]/10 hover:bg-[#ff1744]/20 rounded-lg transition-colors duration-200"
            >
              <FiStar className="w-5 h-5 text-[#ff1744]" />
              <span className="text-sm font-medium">My Favorites</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-3 p-4 bg-[#39ff14]/10 hover:bg-[#39ff14]/20 rounded-lg transition-colors duration-200"
            >
              <FiTrendingUp className="w-5 h-5 text-[#39ff14]" />
              <span className="text-sm font-medium">Trending Now</span>
            </Link>
            <button className="flex items-center gap-3 p-4 bg-[#a0aec0]/10 hover:bg-[#a0aec0]/20 rounded-lg transition-colors duration-200">
              <FiSettings className="w-5 h-5 text-[#a0aec0]" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#2a2a2a] p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-lg">
                  <div className="w-10 h-10 bg-[#0ff0fc]/10 rounded-full flex items-center justify-center">
                    <FiStar className="w-5 h-5 text-[#0ff0fc]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-[#a0aec0]">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#a0aec0]">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;