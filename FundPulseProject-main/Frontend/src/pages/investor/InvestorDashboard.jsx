"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import StatsCard from "../../components/StatsCard";

function InvestorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    loading: true,
    error: null,
  });
  const [recentInvestments, setRecentInvestments] = useState({
    data: [],
    loading: true,
    error: null,
  });

  // Force scroll reset on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }, []);

  // Fetch investment stats from backend
  useEffect(() => {
    const fetchData = async () => {
      const investorId = localStorage.getItem("investorId");
      if (!investorId) {
        setStats((prev) => ({ ...prev, loading: false, error: "Investor ID not found" }));
        setRecentInvestments((prev) => ({
          ...prev,
          loading: false,
          error: "Investor ID not found",
        }));
        return;
      }

      try {
        // Fetch stats
        const statsResponse = await axios.get(`${API_BASE_URL}/investment/get-invested`, {
          params: { investorId },
        });
        console.log(statsResponse.data);

        setStats({
          totalInvested: statsResponse.data.totalInvested || 0,
          activeInvestments: statsResponse.data.activeInvestments || 0,
          loading: false,
          error: null,
        });

        // Fetch recent investments
        const investmentsResponse = await axios.get(`${API_BASE_URL}/investment/recent`, {
          params: { investorId }, // Get 3 most recent investments
        });

        console.log(investmentsResponse.data);
        setRecentInvestments({
          data: investmentsResponse.data || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
        setRecentInvestments((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  if (stats.loading || recentInvestments.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (stats.error || recentInvestments.error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center py-12 text-red-500">
          <p>Error loading dashboard: {stats.error || recentInvestments.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Investor Dashboard
          </h1>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Discover promising startups and track your investments in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/investor/explore"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
            >
              Explore Projects
            </Link>
            <Link
              to="/investor/track"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-md font-medium transition duration-300"
            >
              Track Investment
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Investment Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="Total Invested"
              value={`${stats.totalInvested.toFixed(2)} ETH`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatsCard
              title="Active Investments"
              value={stats.activeInvestments}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Recent Investments Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Investments</h2>
            <Link to="/investor/track" className="text-green-600 hover:text-green-700 font-medium">
              View All
            </Link>
          </div>

          {recentInvestments.data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">You haven't made any investments yet.</p>
              <Link
                to="/investor/explore"
                className="mt-4 inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
              >
                Explore Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {recentInvestments.data.map((investment) => (
                <div key={investment._id || investment.id || investment.investmentId || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {investment.projectName || `Project ${investment.investmentId}`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {investment.projectDescription || "No description available"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Invested: {investment.totalInvested?.toFixed(2) || "0"} ETH
                      </span>
                      {investment.equityPercentage && (
                        <span className="text-sm font-medium text-green-600">
                          {investment.equityPercentage.toFixed(2)}% Equity
                        </span>
                      )}
                    </div>
                    {/* <div className="mt-4">
                      <Link
                        to={`/investor/track?project=${investment.investmentId}`}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestorDashboard;
