"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

function BackProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [updatingProject, setUpdatingProject] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToEnd, setProjectToEnd] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      let startupId = localStorage.getItem("startupId");
      const response = await axios.get(`${API_BASE_URL}/api/back-proposals/${startupId}`);
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching projects:", err);
    }
  };

  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  const confirmEndProject = (project) => {
    setProjectToEnd(project);
    setShowConfirmModal(true);
  };

  const handleEndProject = async () => {
    if (!projectToEnd) return;

    try {
      setUpdatingProject(projectToEnd.id);
      await axios.put(`${API_BASE_URL}/api/projects/${projectToEnd.id}/end`);
      await fetchProjects();
    } catch (err) {
      console.error("Error ending project:", err);
      alert("Failed to end project");
    } finally {
      setUpdatingProject(null);
      setShowConfirmModal(false);
      setProjectToEnd(null);
    }
  };

  // Filter projects by sector
  const filteredBySector = selectedSector
    ? projects.filter((project) => project.sector.toLowerCase() === selectedSector.toLowerCase())
    : projects;

  // Filter and sort projects by status
  const filteredAndSortedByStatus = filteredBySector
    .filter((project) => {
      if (selectedStatus === "active") return project.status;
      if (selectedStatus === "ended") return !project.status;
      return true;
    })
    .sort((a, b) => {
      if (a.status && !b.status) return -1;
      if (!a.status && b.status) return 1;
      return 0;
    });

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
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Back Projects</h1>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Discover innovative startups and their funding progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Sector</label>
            <select
              value={selectedSector}
              onChange={handleSectorChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Sectors</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Projects</option>
              <option value="active">Active Only</option>
              <option value="ended">Ended Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        {filteredAndSortedByStatus.map((project) => {
          const isUpdating = updatingProject === project.id;
          const isActive = project.status;

          return (
            <div
              key={project.id || project._id || project.proposalId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
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
                  <span>
                    {Math.round((project.raisedAmount / project.amountToRaise) * 100)}% Funded
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (project.raisedAmount / project.amountToRaise) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Equity Offered:{" "}
                      <span className="font-medium text-gray-700">{project.equityPercentage}%</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Expiry date:{" "}
                      <span
                        className={`font-medium ${isActive ? "text-gray-700" : "text-red-600"}`}
                      >
                        {formatDate(project.endDate)}
                        {!isActive && " (Ended)"}
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

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      isActive ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isActive ? "Funding Active" : "Funding Ended"}
                  </span>

                  {isActive && (
                    <button
                      onClick={() => confirmEndProject(project)}
                      disabled={isUpdating}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isUpdating
                          ? "bg-gray-100 text-gray-800 cursor-not-allowed"
                          : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                      }`}
                    >
                      {isUpdating ? "Processing..." : "End Project"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && projectToEnd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm End Project</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to end the project <strong>{projectToEnd.projectName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEndProject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
              >
                Confirm End Project
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && filteredAndSortedByStatus.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No projects found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default BackProjects;
