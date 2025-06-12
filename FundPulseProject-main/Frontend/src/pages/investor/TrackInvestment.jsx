"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

function TrackInvestment() {
  const [pastInvestments, setPastInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch investments from backend
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const investorId = localStorage.getItem("investorId");
        if (!investorId) {
          throw new Error("Investor ID not found");
        }

        const response = await axios.get(`${API_BASE_URL}/investment/get`, {
          params: { investorId },
        });

        // Transform backend data to match frontend structure
        console.log(response.data);
        const investments = response.data.map((investment) => ({
          id: investment.investmentId,
          name: investment.projectName,
          description: investment.projectDescription,
          sector: investment.projectSector,
          totalInvested: investment.totalInvested,
          equityPercentage: investment.equityPercentage,

          expanded: false,
        }));

        setPastInvestments(investments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching investments:", err);
      }
    };

    fetchInvestments();
  }, []);

  // Toggle expanded state for a project
  const toggleExpand = (projectId) => {
    setPastInvestments(
      pastInvestments.map((project) =>
        project.id === projectId ? { ...project, expanded: !project.expanded } : project
      )
    );
  };

  // Prepare data for pie chart
  const getEquityDistributionData = (project) => {
    return [
      { name: "Your Equity", value: project.equityPercentage },
      { name: "Other Investors", value: 100 - project.equityPercentage },
    ];
  };

  // Colors for pie chart
  const COLORS = ["#4ade80", "#e5e7eb"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading investments: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Investments</h1>

      {pastInvestments.length > 0 ? (
        <div className="space-y-6">
          {pastInvestments.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {project.sector}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="mt-2 md:mt-0 text-green-600 hover:text-green-700 font-medium flex items-center"
                  >
                    {project.expanded ? "Hide Details" : "Show Details"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-1 h-5 w-5 transform transition-transform ${
                        project.expanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Invested</h3>
                    <p className="text-xl font-bold text-gray-800">{project.totalInvested} ETH</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Equity Owned</h3>
                    <p className="text-xl font-bold text-green-600">{project.equityPercentage}%</p>
                  </div>
                </div>

                {project.expanded && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                          Equity Distribution
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getEquityDistributionData(project)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getEquityDistributionData(project).map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, "Equity"]} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Investments Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't made any investments yet. Start exploring projects to invest in.
          </p>
          <Link
            to="/investor/search"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
          >
            Explore Projects
          </Link>
        </div>
      )}
    </div>
  );
}

export default TrackInvestment;
