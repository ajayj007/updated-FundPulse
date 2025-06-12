"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../config";

function CurrentProposals() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [investors, setInvestors] = useState({});
  const [daysRemaining, setDaysRemaining] = useState({});
  const [expandedProposals, setExpandedProposals] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startupId = localStorage.getItem("startupId");
        const proposalsResponse = await axios.get(
          `${API_BASE_URL}/api/active-proposals/${startupId}`
        );

        if (proposalsResponse.data && proposalsResponse.data.length > 0) {
          setProposals(proposalsResponse.data);

          const remainingDays = {};
          proposalsResponse.data.forEach((proposal) => {
            remainingDays[proposal.id] = calculateDaysRemaining(proposal.endDate);
          });
          setDaysRemaining(remainingDays);

          // Initialize expanded state to false for all proposals
          const initialExpandedState = {};
          proposalsResponse.data.forEach((proposal) => {
            initialExpandedState[proposal.id] = false;
          });
          setExpandedProposals(initialExpandedState);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const toggleDetails = async (proposalId) => {
    // Toggle expanded state
    setExpandedProposals((prev) => ({
      ...prev,
      [proposalId]: !prev[proposalId],
    }));

    // Fetch investors if not already loaded and we're expanding
    if (!investors[proposalId] && !expandedProposals[proposalId]) {
      try {
        console.log(proposalId);
        const investorsResponse = await axios.get(`${API_BASE_URL}/investment/get-investors`, {
          params: { proposalId },
        });

        console.log(investorsResponse.data);
        setInvestors((prev) => ({
          ...prev,
          [proposalId]: investorsResponse.data,
        }));
      } catch (err) {
        console.error("Error fetching investors:", err);
      }
    }
  };

  const getPieData = (proposalId) => {
    const proposalInvestors = investors[proposalId] || [];
    const pieData = proposalInvestors.map((investor) => ({
      name: investor.name,
      value: investor.equity,
    }));

    const proposal = proposals.find((p) => p.id === proposalId);
    if (proposal) {
      const totalEquityDistributed = proposalInvestors.reduce(
        (sum, investor) => sum + investor.equity,
        0
      );

      if (totalEquityDistributed < proposal.equityPercentage) {
        pieData.push({
          name: "Remaining",
          value: proposal.equityPercentage - totalEquityDistributed,
        });
      }
    }

    return pieData;
  };

  const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#d1fae5"];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading proposals: {error}</p>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Proposals</h1>

      {proposals.length > 0 ? (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id || proposal._id || proposal.proposalId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{proposal.projectName}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {proposal.sector}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{proposal.reason}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Funding Goal</h3>
                    <p className="text-xl font-bold text-gray-800">{proposal.amountToRaise} ETH</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Amount Raised</h3>
                    <p className="text-xl font-bold text-green-600">{proposal.raisedAmount} ETH</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Equity Offered</h3>
                    <p className="text-xl font-bold text-gray-800">{proposal.equityPercentage}%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Days Remaining</h3>
                    <p className="text-xl font-bold text-gray-800">
                      {daysRemaining[proposal.proposalId] || 0}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Funding Progress</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>{proposal.raisedAmount} ETH</span>
                    <span>
                      {Math.round((proposal.raisedAmount / proposal.amountToRaise) * 100)}%
                    </span>
                    <span>{proposal.amountToRaise} ETH</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (proposal.raisedAmount / proposal.amountToRaise) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => toggleDetails(proposal.proposalId)}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                >
                  {expandedProposals[proposal.proposalId] ? "Hide Details" : "Show More Details"}
                </button>

                {expandedProposals[proposal.proposalId] && (
                  <div className="mt-6 space-y-6">
                    {/* Equity Distribution Chart */}
                    {/* <div className="bg-gray-50 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Equity Distribution</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getPieData(proposal.proposalId)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {getPieData(proposal.proposalId).map((entry, index) => (
                                <Cell
                                  key={`cell-${proposal.proposalId}-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Equity"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div> */}

                    {/* Investors List */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Investors</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Investor
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount Invested
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Equity Stake
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(investors[proposal.proposalId] || []).length > 0 ? (
                              (investors[proposal.proposalId] || []).map((investor, index) => (
                                <tr
                                  key={
                                    investor.id ||
                                    investor.investorId ||
                                    investor._id ||
                                    `investor-${index}`
                                  }
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {investor.name}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {investor.amountInvested} ETH
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {investor.equityPercentage}%
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(
                                      investor.investmentDate || investor.date
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                  No investors yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Proposals Found</h2>
          <p className="text-gray-600 mb-6">
            You don't have any proposals at the moment. Create a new project to start raising funds.
          </p>
          <Link
            to="/startup/add-project"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
          >
            Create New Project
          </Link>
        </div>
      )}
    </div>
  );
}

export default CurrentProposals;
