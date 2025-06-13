// "use client";

// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { connectWallet, getWalletBalance } from "../utils/walletUtils";

// function Navbar() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [walletBalance, setWalletBalance] = useState("0.00");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   // Check if we're on an investor page
//   const isInvestorPage = location.pathname.startsWith("/investor");
//   const isSPage = location.pathname.startsWith("/startup");
  
//   const handleConnectWallet = async () => {
//   try {
//     const { address, provider, connected } = await connectWallet();
//     if (!connected || !provider) return;

//     const balance = await getWalletBalance(provider, address);
//     setIsConnected(connected);
//     setWalletAddress(address);
//     setWalletBalance(balance);
//   } catch (error) {
//     console.error("Failed to connect wallet:", error);
//   }
// };


//   return (
//     <nav className="bg-white mb-5 shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link
//               to={isInvestorPage ? "/investor" : "/startup"}
//               className="flex-shrink-0 flex items-center"
//             >
//               <span className="text-2xl font-bold text-gray-800">
//                 Fund<span className="text-green-600">Pulse</span>
//               </span>
//             </Link>

//             {isConnected && (
//              <div className="px-3 py-2 text-gray-700">
//              <span className="font-medium">Balance:</span>
//              <span className="ml-2 text-green-600 font-bold">{walletBalance} ETH</span>
//              </div>
//       )}


//           </div>

//           {/* Desktop menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {isInvestorPage ? (
//               // Investor Navigation Items
//               <>
//                 <Link
//                   to="/investor/explore"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Explore
//                 </Link>
//                 <Link
//                   to="/investor/track"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Track
//                 </Link>
//                 <Link
//                   to="/investor/chatbox"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Chatbox
//                 </Link>
//                 <Link
//                   to="/investor/profile"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Profile
//                 </Link>{" "}
//                 <Link
//                   to="/"
//                   onClick={() => {
//                     // Remove startup ID from localStorage
//                     localStorage.removeItem("investorId");
//                   }}
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Logout
//                 </Link>
//               </>
//             ) : (
//               // Startup Navigation Items
//               <>
//                 <Link
//                   to="/startup/profile"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Profile
//                 </Link>
//                 <Link
//                   to="/startup/add-project"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Add Project
//                 </Link>
//                 <Link
//                   to="/startup/back-projects"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Back Projects
//                 </Link>
//                 <Link
//                   to="/startup/current-proposal"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Current Proposal
//                 </Link>
//                 <Link
//                   to="/"
//                   onClick={() => {
//                     // Remove startup ID from localStorage
//                     localStorage.removeItem("startupId");
//                   }}
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Logout
//                 </Link>
//                 <Link
//                   to="/startup/chatbox"
//                   className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Chatbox
//                 </Link>
//               </>
//             )}

//             <button
//               onClick={handleConnectWallet}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               {isConnected
//                 ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
//                     walletAddress.length - 4
//                   )}`
//                 : "Connect Wallet"}
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 {mobileMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {isConnected && (
//             <div className="ml-6 hidden md:flex items-center">
//             <span className="text-gray-700 font-medium">Balance:</span>
//             <span className="ml-2 text-green-600 font-bold">{walletBalance} ETH</span>
//             </div>
//             )}


//             {isInvestorPage ? (
//               // Investor Mobile Navigation
//               <>
//                 <Link
//                   to="/chatbox"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Chatbox
//                 </Link>
//                 <Link
//                   to="/investor/profile"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Profile
//                 </Link>
//               </>
//             ) : (
//               // Startup Mobile Navigation
//               <>
//                 <Link
//                   to="/profile"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Profile
//                 </Link>
//                 <Link
//                   to="/add-project"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Add Project
//                 </Link>
//                 <Link
//                   to="/back-projects"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Back Projects
//                 </Link>
//                 <Link
//                   to="/current-proposal"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Current Proposal
//                 </Link>
//                 <Link
//                   to="/chatbox"
//                   className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Chatbox
//                 </Link>
//               </>
//             )}

//             <button
//               onClick={handleConnectWallet}
//               className="w-full text-left bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium transition duration-300 mt-2"
//             >
//               {isConnected
//                 ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
//                     walletAddress.length - 4
//                   )}`
//                 : "Connect Wallet"}
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;



"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { connectWallet, getWalletBalance } from "../utils/walletUtils";

function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we're on an investor page
  const isInvestorPage = location.pathname.startsWith("/investor");
  const isSPage = location.pathname.startsWith("/startup");
  
  const handleConnectWallet = async () => {
    try {
      const { address, provider, connected } = await connectWallet();
      if (!connected || !provider) return;

      const balance = await getWalletBalance(provider, address);
      setIsConnected(connected);
      setWalletAddress(address);
      setWalletBalance(balance);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("startupId");
    localStorage.removeItem("investorId");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsConnected(false);
    setWalletAddress("");
    setWalletBalance("0.00");
  };

  return (
    <nav className="bg-white mb-5 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={isInvestorPage ? "/investor" : "/startup"}
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-bold text-gray-800">
                Fund<span className="text-green-600">Pulse</span>
              </span>
            </Link>

            {isConnected && (
              <div className="px-3 py-2 text-gray-700">
                <span className="font-medium">Balance:</span>
                <span className="ml-2 text-green-600 font-bold">{walletBalance} ETH</span>
              </div>
            )}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isInvestorPage ? (
              // Investor Navigation Items
              <>
                <Link
                  to="/investor/explore"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Explore
                </Link>
                <Link
                  to="/investor/track"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Track
                </Link>
                <Link
                  to="/investor/chatbox"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Chatbox
                </Link>
                <Link
                  to="/investor/profile"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </Link>
              </>
            ) : (
              // Startup Navigation Items
              <>
                <Link
                  to="/startup/profile"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/startup/add-project"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Project
                </Link>
                <Link
                  to="/startup/back-projects"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Back Projects
                </Link>
                <Link
                  to="/startup/current-proposal"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Current Proposal
                </Link>
                <Link
                  to="/startup/chatbox"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Chatbox
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </Link>
              </>
            )}

            <button
              onClick={handleConnectWallet}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              {isConnected
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
                    walletAddress.length - 4
                  )}`
                : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isConnected && (
              <div className="px-3 py-2 text-gray-700">
                <span className="font-medium">Balance:</span>
                <span className="ml-2 text-green-600 font-bold">{walletBalance} ETH</span>
              </div>
            )}

            {isInvestorPage ? (
              // Investor Mobile Navigation
              <>
                <Link
                  to="/investor/explore"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Explore
                </Link>
                <Link
                  to="/investor/track"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Track
                </Link>
                <Link
                  to="/investor/chatbox"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Chatbox
                </Link>
                <Link
                  to="/investor/profile"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
              </>
            ) : (
              // Startup Mobile Navigation
              <>
                <Link
                  to="/startup/profile"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/startup/add-project"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Add Project
                </Link>
                <Link
                  to="/startup/back-projects"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Back Projects
                </Link>
                <Link
                  to="/startup/current-proposal"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Current Proposal
                </Link>
                <Link
                  to="/startup/chatbox"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Chatbox
                </Link>
              </>
            )}

            <Link
              to="/"
              onClick={handleLogout}
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </Link>

            <button
              onClick={handleConnectWallet}
              className="w-full text-left bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium transition duration-300 mt-2"
            >
              {isConnected
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
                    walletAddress.length - 4
                  )}`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;