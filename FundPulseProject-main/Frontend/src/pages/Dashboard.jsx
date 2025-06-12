import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import { useEffect } from "react";

function Dashboard() {
  // Mock data for stats
  const stats = {
    projects: 42,
    backings: 156,
    ethDonated: 78.5,
  };

  // Force scroll reset on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }, []);

  return (
    <div className="h-full min-h-screen w-full overflow-auto">
      <div className="min-h-[calc(100vh-4rem)] space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Empowering Dreams, Funding Futures Together With{" "}
            <span className="text-green-600">FUNDCHAIN</span>
          </h1>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Connect with investors who believe in your vision and secure the funding you need to
            bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/startup/add-project"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
            >
              Add Project
            </Link>
            <Link
              to="/startup/back-projects"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-md font-medium transition duration-300"
            >
              Back Projects
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Projects"
              value={stats.projects}
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
            <StatsCard
              title="Total Backings"
              value={stats.backings}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
            />
            <StatsCard
              title="ETH Donated"
              value={`${stats.ethDonated} ETH`}
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
          </div>
        </div>

        {/* Recent Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Projects</h2>
            <Link
              to="/startup/back-projects"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Project Name {item}</h3>
                  <p className="text-gray-600 mb-4">
                    Short description of the project goes here. This is a brief overview.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Goal: 10 ETH</span>
                    <span className="text-sm font-medium text-green-600">60% Funded</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
