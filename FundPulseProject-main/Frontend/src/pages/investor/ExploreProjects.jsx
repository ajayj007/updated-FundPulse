// Updated ExploreProjects.js with fixes for startup wallet address

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { sendTransaction } from "../../utils/walletUtils";

function ExploreProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTransacting, setIsTransacting] = useState(false);

  // Get wallet info from props or context
  const [walletInfo, setWalletInfo] = useState({
    provider: null,
    address: "",
    connected: false
  });

  useEffect(() => {
    // Check if wallet is connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const { ethers } = await import('ethers');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setWalletInfo({
              provider,
              address: accounts[0],
              connected: true
            });
          }
        } catch (error) {
          console.log("Wallet not connected");
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/proposals`, {});
        
        // Process projects to ensure startupWalletAddress is available
        const processedProjects = response.data.map(project => ({
          ...project,
          // Map the startup address from contract to startupWalletAddress
          startupWalletAddress: project.startup || project.startupWalletAddress || project.walletAddress
        }));
        
        setProjects(processedProjects);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [searchQuery, selectedSector]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useEffect dependency on searchQuery
  };

  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Calculate days remaining for each project
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter projects by sector
  const filteredBySector = selectedSector
    ? projects.filter((project) => project.sector.toLowerCase() === selectedSector.toLowerCase())
    : projects;

  // Filter projects by status
  const filteredByStatus = filteredBySector.filter((project) => {
    const daysLeft = calculateDaysRemaining(project.endDate);
    if (selectedStatus === "active") return daysLeft > 0;
    if (selectedStatus === "ended") return daysLeft <= 0;
    return true; // "all" status
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredByStatus].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "funding") {
      return b.raisedAmount / b.amountToRaise - a.raisedAmount / a.amountToRaise;
    } else if (sortBy === "daysLeft") {
      return calculateDaysRemaining(a.endDate) - calculateDaysRemaining(b.endDate);
    }
    return 0;
  });

  const handleInvestmentChange = (proposalId, value) => {
    setInvestmentAmount({
      ...investmentAmount,
      [proposalId]: value,
    });
  };

  const handleInvest = (project) => {
    if (!walletInfo.connected) {
      alert("Please connect your wallet first to make an investment.");
      return;
    }

    // Check if project has a startup wallet address
    if (!project.startupWalletAddress && !project.startup && !project.startupAddress) {
      alert("Startup wallet address not found. This project may not be properly configured.");
      return;
    }

    setSelectedProject(project);
    setShowModal(true);
  };

  const confirmInvestment = async () => {
    const amount = Number.parseFloat(investmentAmount[selectedProject.proposalId] || 0);

    if (amount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    if (!walletInfo.connected || !walletInfo.provider) {
      alert("Please connect your wallet to make an investment.");
      return;
    }

    // Get the startup address - try multiple possible field names
    const startupAddress = selectedProject.startupWalletAddress || 
                          selectedProject.startup || 
                          selectedProject.startupAddress;

    if (!startupAddress) {
      alert("Startup wallet address not found. Cannot process investment.");
      return;
    }

    setIsTransacting(true);

    try {
      // Send blockchain transaction
      const transactionResult = await sendTransaction(
        walletInfo.provider,
        startupAddress, // Use the resolved startup address
        amount
      );

      if (transactionResult.success) {
        // If blockchain transaction successful, update backend
        try {
          await axios.post(`${API_BASE_URL}/investment/invest`, {
            proposalId: selectedProject.proposalId,
            amount: amount,
            investorId: localStorage.getItem("investorId"),
            transactionHash: transactionResult.hash,
            investorWalletAddress: walletInfo.address,
            startupWalletAddress: startupAddress
          });

          // Update local state optimistically
          const updatedProjects = projects.map((p) => {
            if (p.proposalId === selectedProject.proposalId) {
              return {
                ...p,
                raisedAmount: Math.min(p.raisedAmount + amount, p.amountToRaise),
              };
            }
            return p;
          });

          setProjects(updatedProjects);
          setShowModal(false);

          // Clear the investment amount for this project
          const newInvestmentAmount = { ...investmentAmount };
          delete newInvestmentAmount[selectedProject.proposalId];
          setInvestmentAmount(newInvestmentAmount);

          alert(`Investment successful! Transaction Hash: ${transactionResult.hash}`);

        } catch (backendError) {
          console.error("Backend update failed:", backendError);
          alert("Blockchain transaction successful, but failed to update records. Please contact support with transaction hash: " + transactionResult.hash);
        }
      } else {
        alert(`Transaction failed: ${transactionResult.message}`);
      }
    } catch (err) {
      console.error("Error making investment:", err);
      alert("Failed to make investment. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

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
        <p>Error loading projects: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Projects</h1>

      {/* Wallet Connection Status */}
      {!walletInfo.connected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800">
              Please connect your wallet to make investments in projects.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200/50 backdrop-blur-sm bg-opacity-90">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sector Filter */}
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Sector
              </label>
              <div className="relative">
                <select
                  id="sector"
                  value={selectedSector}
                  onChange={handleSectorChange}
                  className="w-full px-4 py-3 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Sectors</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active Only</option>
                  <option value="ended">Ended Only</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="funding">Most Funded</option>
                  <option value="daysLeft">Ending Soonest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedProjects.map((project, index) => {
          const key = project.proposalId || `project-${index}`;
          const daysLeft = calculateDaysRemaining(project.endDate);
          const fundingPercentage = Math.round(
            (project.raisedAmount / project.amountToRaise) * 100
          );

          // Get startup address for display
          const startupAddress = project.startupWalletAddress || 
                                 project.startup || 
                                 project.startupAddress;

          return (
            <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{project.projectName}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {project.sector}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{project.reason}</p>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>Goal: {project.amountToRaise} ETH</span>
                  <span>{fundingPercentage}% Funded</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out origin-left"
                      style={{
                        transform: `scaleX(${Math.min(fundingPercentage, 100) / 100})`,
                        width: "100%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Equity Offered:{" "}
                      <span className="font-medium text-gray-700">{project.equityPercentage}%</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Days Left:{" "}
                      <span
                        className={`font-medium ${daysLeft > 0 ? "text-gray-700" : "text-red-600"}`}
                      >
                        {daysLeft > 0 ? daysLeft : "Ended"}
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <p className="text-sm text-gray-500">
                      Raised:{" "}
                      <span className="font-medium text-gray-700">{project.raisedAmount} ETH</span>
                    </p>
                  </div>
                </div>

                {/* Debug info - remove in production */}
                {!startupAddress && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-4">
                    <p className="text-xs text-red-600">
                      ⚠️ No startup address found for this project
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="number"
                    value={investmentAmount[project.proposalId] || ""}
                    onChange={(e) => handleInvestmentChange(project.proposalId, e.target.value)}
                    placeholder="ETH Amount"
                    step="0.01"
                    min="0.01"
                    max={Math.abs(project.amountToRaise - project.raisedAmount)}
                    className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => handleInvest(project)}
                    disabled={
                      !walletInfo.connected ||
                      !startupAddress ||
                      !investmentAmount[project.proposalId] ||
                      Number.parseFloat(investmentAmount[project.proposalId]) <= 0 ||
                      daysLeft <= 0 ||
                      project.raisedAmount >= project.amountToRaise ||
                      Number.parseFloat(investmentAmount[project.proposalId]) >
                        Math.abs(project.amountToRaise - project.raisedAmount)
                    }
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {!walletInfo.connected ? "Connect Wallet" : 
                     !startupAddress ? "Address Missing" :
                     daysLeft <= 0 ? "Funding Ended" : "Invest Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investment Confirmation Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Investment</h3>
            <p className="text-gray-600 mb-4">
              You are about to invest{" "}
              <span className="font-bold text-green-600">
                {investmentAmount[selectedProject.proposalId] || 0} ETH
              </span>{" "}
              in <span className="font-bold">{selectedProject.projectName}</span>.
            </p>
            <p className="text-gray-600 mb-4">
              This will give you approximately{" "}
              <span className="font-bold text-green-600">
                {(
                  (Number.parseFloat(investmentAmount[selectedProject.proposalId] || 0) /
                    selectedProject.amountToRaise) *
                  selectedProject.equityPercentage
                ).toFixed(2)}
                %
              </span>{" "}
              equity in the project.
            </p>
            
            {/* Transaction details */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">From:</span> {walletInfo.address ? `${walletInfo.address.substring(0, 6)}...${walletInfo.address.substring(walletInfo.address.length - 4)}` : 'Your Wallet'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">To:</span> {(selectedProject.startupWalletAddress || selectedProject.startup || selectedProject.startupAddress) ? `${(selectedProject.startupWalletAddress || selectedProject.startup || selectedProject.startupAddress).substring(0, 6)}...${(selectedProject.startupWalletAddress || selectedProject.startup || selectedProject.startupAddress).substring((selectedProject.startupWalletAddress || selectedProject.startup || selectedProject.startupAddress).length - 4)}` : 'Startup Wallet'}
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={isTransacting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmInvestment}
                disabled={isTransacting}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isTransacting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Investment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && sortedProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            No projects found matching your criteria. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExploreProjects;