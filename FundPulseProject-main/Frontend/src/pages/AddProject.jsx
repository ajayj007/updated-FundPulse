// "use client";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../config";

// function AddProject() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     projectName: "",
//     amountToRaise: "",
//     reason: "",
//     equity: "",
//     sector: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Validate project name
//     if (!formData.projectName.trim()) {
//       newErrors.projectName = "Project name is required";
//     }

//     // Validate amount to raise
//     if (!formData.amountToRaise) {
//       newErrors.amountToRaise = "Amount is required";
//     } else if (isNaN(formData.amountToRaise) || Number.parseFloat(formData.amountToRaise) <= 0) {
//       newErrors.amountToRaise = "Amount must be a positive number";
//     }

//     // Validate reason
//     if (!formData.reason.trim()) {
//       newErrors.reason = "Reason is required";
//     }

//     // Validate equity percentage
//     if (!formData.equityPercentage) {
//       newErrors.equityPercentage = "Equity percentage is required";
//     } else if (
//       isNaN(formData.equityPercentage) ||
//       Number.parseFloat(formData.equityPercentage) <= 0 ||
//       Number.parseFloat(formData.equityPercentage) > 100
//     ) {
//       newErrors.equityPercentage = "Equity must be between 0 and 100";
//     }

//     // Validate sector
//     if (!formData.sector.trim()) {
//       newErrors.sector = "Sector is required";
//     }

//     // Validate dates
//     if (!formData.startDate) {
//       newErrors.startDate = "Start date is required";
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = "End date is required";
//     } else if (formData.startDate && formData.endDate) {
//       const start = new Date(formData.startDate);
//       const end = new Date(formData.endDate);
//       const diffTime = Math.abs(end - start);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       if (end <= start) {
//         newErrors.endDate = "End date must be after start date";
//       } else if (diffDays > 5) {
//         newErrors.endDate = "End date must be within 5 days of start date";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       const startupId = localStorage.getItem("startupId");

//       if (!startupId) {
//         alert("Startup ID not found. Please log in again.");
//         return;
//       }

//       const proposalData = {
//         projectName: formData.projectName,
//         amountToRaise: parseFloat(formData.amountToRaise),
//         reason: formData.reason,
//         equityPercentage: parseFloat(formData.equityPercentage),
//         sector: formData.sector,
//         startDate: new Date(formData.startDate).toISOString(), // ISO format
//         endDate: new Date(formData.endDate).toISOString(),
//       };

//       try {
//         const response = await axios.post(
//           `${API_BASE_URL}/startup/add-proposal/${startupId}`,
//           proposalData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Proposal submitted:", response.data);
//         navigate("/startup");
//       } catch (error) {
//         console.error("Error submitting proposal:", error);
//         alert("Failed to submit proposal. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Project</h1>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="col-span-2">
//               <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Project Name
//               </label>
//               <input
//                 type="text"
//                 id="projectName"
//                 name="projectName"
//                 value={formData.projectName}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.projectName ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.projectName && (
//                 <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="amountToRaise"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Amount to Raise (ETH)
//               </label>
//               <input
//                 type="number"
//                 id="amountToRaise"
//                 name="amountToRaise"
//                 value={formData.amountToRaise}
//                 onChange={handleChange}
//                 step="0.01"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.amountToRaise ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.amountToRaise && (
//                 <p className="mt-1 text-sm text-red-500">{errors.amountToRaise}</p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="equityPercentage"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Equity Percentage (%)
//               </label>
//               <input
//                 type="number"
//                 id="equityPercentage"
//                 name="equityPercentage"
//                 value={formData.equityPercentage}
//                 onChange={handleChange}
//                 step="0.01"
//                 min="0"
//                 max="100"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.equityPercentage ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.equityPercentage && (
//                 <p className="mt-1 text-sm text-red-500">{errors.equityPercentage}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
//                 Sector
//               </label>
//               <select
//                 id="sector"
//                 name="sector"
//                 value={formData.sector}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.sector ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select a sector</option>
//                 <option value="technology">Technology</option>
//                 <option value="healthcare">Healthcare</option>
//                 <option value="finance">Finance</option>
//                 <option value="education">Education</option>
//                 <option value="ecommerce">E-Commerce</option>
//                 <option value="entertainment">Entertainment</option>
//                 <option value="other">Other</option>
//               </select>
//               {errors.sector && <p className="mt-1 text-sm text-red-500">{errors.sector}</p>}
//             </div>

//             <div>
//               <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.startDate ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
//             </div>

//             <div>
//               <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 End Date (within 5 days of start)
//               </label>
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.endDate ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
//             </div>

//             <div className="col-span-2">
//               <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Fundraising
//               </label>
//               <textarea
//                 id="reason"
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleChange}
//                 rows="4"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.reason ? "border-red-500" : "border-gray-300"
//                 }`}
//               ></textarea>
//               {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason}</p>}
//             </div>
//           </div>

//           <div className="mt-8 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
//             >
//               Submit Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProject;





// "use client";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../config";
// import { connectWallet } from "../utils/walletUtils";

// function AddProject() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     projectName: "",
//     amountToRaise: "",
//     reason: "",
//     equityPercentage: "",
//     sector: "",
//     startDate: "",
//     endDate: "",
//     walletAddress: "", // Add walletAddress to state
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error for the field
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.projectName.trim()) {
//       newErrors.projectName = "Project name is required";
//     }

//     if (!formData.amountToRaise) {
//       newErrors.amountToRaise = "Amount is required";
//     } else if (isNaN(formData.amountToRaise) || parseFloat(formData.amountToRaise) <= 0) {
//       newErrors.amountToRaise = "Amount must be a positive number";
//     }

//     if (!formData.reason.trim()) {
//       newErrors.reason = "Reason is required";
//     }

//     if (!formData.equityPercentage) {
//       newErrors.equityPercentage = "Equity percentage is required";
//     } else if (
//       isNaN(formData.equityPercentage) ||
//       parseFloat(formData.equityPercentage) <= 0 ||
//       parseFloat(formData.equityPercentage) > 100
//     ) {
//       newErrors.equityPercentage = "Equity must be between 0 and 100";
//     }

//     if (!formData.sector.trim()) {
//       newErrors.sector = "Sector is required";
//     }

//     if (!formData.startDate) {
//       newErrors.startDate = "Start date is required";
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = "End date is required";
//     } else if (formData.startDate && formData.endDate) {
//       const start = new Date(formData.startDate);
//       const end = new Date(formData.endDate);
//       const diffTime = Math.abs(end - start);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       if (end <= start) {
//         newErrors.endDate = "End date must be after start date";
//       } else if (diffDays > 5) {
//         newErrors.endDate = "End date must be within 5 days of start date";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const startupId = localStorage.getItem("startupId");
//     if (!startupId) {
//       alert("Startup ID not found. Please log in again.");
//       return;
//     }

//     try {
//       const { walletAddress } = await connectWallet();

//       if (!walletAddress) {
//         console.log(walletAddress)
//         alert("Failed to connect to wallet.");
//         return;
//       }

//       const proposalData = {
//         projectName: formData.projectName,
//         amountToRaise: parseFloat(formData.amountToRaise),
//         reason: formData.reason,
//         equityPercentage: parseFloat(formData.equityPercentage),
//         sector: formData.sector,
//         startDate: new Date(formData.startDate).toISOString(),
//         endDate: new Date(formData.endDate).toISOString(),
//       };

//       const response = await axios.post(
//         `${API_BASE_URL}/startup/add-proposal/${startupId}`,
//         proposalData,
//         {
//           params: { walletAddress }, // pass as query param
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setFormData((prev) => ({
//         ...prev,
//         walletAddress,
//       }));

//       console.log("Proposal submitted:", response.data);
//       navigate("/startup");
//     } catch (error) {
//       console.error("Error submitting proposal:", error);
//       alert("Failed to submit proposal. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Project</h1>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
//             {/* <div className="col-span-2">
//               <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                 Wallet Address (Connected)
//               </label>
//               <input
//                 type="text"
//                 id="walletAddress"
//                 name="walletAddress"
//                 value={formData.walletAddress}
//                 readOnly
//                 className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 border-gray-300"
//               />
//             </div> */}
//             {/* Project Name */}
//             <div className="col-span-2">
//               <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Project Name
//               </label>
//               <input
//                 type="text"
//                 id="projectName"
//                 name="projectName"
//                 value={formData.projectName}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.projectName ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.projectName && (
//                 <p className="text-sm text-red-500">{errors.projectName}</p>
//               )}
//             </div>

//             {/* Amount */}
//             <div>
//               <label htmlFor="amountToRaise" className="block text-sm font-medium text-gray-700 mb-1">
//                 Amount to Raise (ETH)
//               </label>
//               <input
//                 type="number"
//                 id="amountToRaise"
//                 name="amountToRaise"
//                 value={formData.amountToRaise}
//                 onChange={handleChange}
//                 step="0.01"
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.amountToRaise ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.amountToRaise && (
//                 <p className="text-sm text-red-500">{errors.amountToRaise}</p>
//               )}
//             </div>

//             {/* Equity */}
//             <div>
//               <label htmlFor="equityPercentage" className="block text-sm font-medium text-gray-700 mb-1">
//                 Equity Percentage (%)
//               </label>
//               <input
//                 type="number"
//                 id="equityPercentage"
//                 name="equityPercentage"
//                 value={formData.equityPercentage}
//                 onChange={handleChange}
//                 min="0"
//                 max="100"
//                 step="0.01"
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.equityPercentage ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.equityPercentage && (
//                 <p className="text-sm text-red-500">{errors.equityPercentage}</p>
//               )}
//             </div>

//             {/* Sector */}
//             <div>
//               <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
//                 Sector
//               </label>
//               <select
//                 id="sector"
//                 name="sector"
//                 value={formData.sector}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.sector ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select a sector</option>
//                 <option value="technology">Technology</option>
//                 <option value="healthcare">Healthcare</option>
//                 <option value="finance">Finance</option>
//                 <option value="education">Education</option>
//                 <option value="ecommerce">E-Commerce</option>
//                 <option value="entertainment">Entertainment</option>
//                 <option value="other">Other</option>
//               </select>
//               {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
//             </div>

//             {/* Dates */}
//             <div>
//               <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.startDate ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
//             </div>

//             <div>
//               <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 End Date (within 5 days)
//               </label>
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.endDate ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
//             </div>

//             {/* Reason */}
//             <div className="col-span-2">
//               <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Fundraising
//               </label>
//               <textarea
//                 id="reason"
//                 name="reason"
//                 rows="4"
//                 value={formData.reason}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md ${
//                   errors.reason ? "border-red-500" : "border-gray-300"
//                 }`}
//               ></textarea>
//               {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
//             </div>

          
//           </div>

//           <div className="mt-8 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
//             >
//               Submit Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProject;


"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { deployProjectContract } from "../utils/walletUtils";

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    amountToRaise: "",
    equityPercentage: "",
    sector: "",
    startDate: "",
    endDate: "",
    reason: "",
    startupWalletAddress: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState("");
  const [walletInfo, setWalletInfo] = useState({ provider: null, address: "", connected: false });

  // Auto-check wallet on load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length) {
            const { ethers } = await import('ethers');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const address = accounts[0];
            setWalletInfo({ provider, address, connected: true });
            setFormData(prev => ({ ...prev, startupWalletAddress: address }));
          }
        } catch {
          console.log("Wallet check failed");
        }
      }
    };
    checkWalletConnection();
  }, []);

  // Manual connect
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletInfo({ provider, address, connected: true });
      setFormData(prev => ({ ...prev, startupWalletAddress: address }));
    } catch (err) {
      console.error(err);
      alert("Connection failed");
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) newErrors.projectName = "Project name is required";
    if (!formData.amountToRaise) newErrors.amountToRaise = "Amount is required";
    else if (isNaN(formData.amountToRaise) || parseFloat(formData.amountToRaise) <= 0)
      newErrors.amountToRaise = "Amount must be positive";
    if (!formData.equityPercentage) newErrors.equityPercentage = "Equity is required";
    else if (isNaN(formData.equityPercentage) || parseFloat(formData.equityPercentage) <= 0 || parseFloat(formData.equityPercentage) > 100)
      newErrors.equityPercentage = "Equity must be 0–100";
    if (!formData.sector) newErrors.sector = "Sector is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) newErrors.endDate = "End date after start date";
      else if ((end - start) / (1000*60*60*24) > 5) newErrors.endDate = "Within 5 days of start";
    }
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    if (!formData.startupWalletAddress) newErrors.startupWalletAddress = "Wallet is required";
    else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.startupWalletAddress))
      newErrors.startupWalletAddress = "Invalid ETH address";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!walletInfo.connected) {
      alert("Connect your wallet");
      return;
    }
    const startupId = localStorage.getItem("startupId");
    if (!startupId) {
      alert("Login again");
      return;
    }
    setIsSubmitting(true);
    setDeploymentStatus("Deploying smart contract...");

    try {
      const { success, contractAddress, transactionHash, error } = await deployProjectContract(walletInfo.provider, {
        projectName: formData.projectName,
        fundingGoal: formData.amountToRaise,
        equityPercentage: formData.equityPercentage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        sector: formData.sector,
        reason: formData.reason
      });
      if (!success) throw new Error(error);
      setDeploymentStatus("Saving to database...");

      const payload = {
        projectName: formData.projectName,
        amountToRaise: parseFloat(formData.amountToRaise),
        equityPercentage: parseFloat(formData.equityPercentage),
        sector: formData.sector,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        reason: formData.reason,
        contractAddress,
        transactionHash,
        deployerAddress: walletInfo.address
      };

      const response = await axios.post(
        `${API_BASE_URL}/startup/add-proposal/${startupId}`,
        payload,
        { params: { walletAddress: walletInfo.address }, headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);
      setDeploymentStatus("Success! Redirecting...");
      setTimeout(() => navigate("/startup"), 2000);

    } catch (err) {
      console.error(err);
      alert(`Submission failed: ${err.message}`);
      setDeploymentStatus("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {deploymentStatus && (
          <div className="mb-6 p-3 bg-blue-50 rounded flex items-center">
            <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 mr-2" />
            <span className="text-blue-800">{deploymentStatus}</span>
          </div>
        )}

        <div className="mb-6 p-4 bg-gray-50 rounded flex justify-between items-center">
          <h3 className="font-semibold">Wallet Connection</h3>
          {walletInfo.connected ? (
            <span className="text-green-600">
              {walletInfo.address.slice(0,6)}...{walletInfo.address.slice(-4)}
            </span>
          ) : (
            <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded">
              Connect Wallet
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Startup Wallet Address *</label>
            <input
              type="text"
              name="startupWalletAddress"
              value={formData.startupWalletAddress}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
            {errors.startupWalletAddress && <p className="text-red-500 mt-1">{errors.startupWalletAddress}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Project Name *</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.projectName && <p className="text-red-500 mt-1">{errors.projectName}</p>}
            </div>

            <div>
              <label className="block mb-1">Amount to Raise (ETH) *</label>
              <input
                type="number"
                name="amountToRaise"
                value={formData.amountToRaise}
                onChange={handleChange}
                step="0.01"
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.amountToRaise && <p className="text-red-500 mt-1">{errors.amountToRaise}</p>}
            </div>

            <div>
              <label className="block mb-1">Equity Percentage (%) *</label>
              <input
                type="number"
                name="equityPercentage"
                value={formData.equityPercentage}
                onChange={handleChange}
                step="0.01"
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.equityPercentage && <p className="text-red-500 mt-1">{errors.equityPercentage}</p>}
            </div>

            <div>
              <label className="block mb-1">Sector *</label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select a sector</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
              {errors.sector && <p className="text-red-500 mt-1">{errors.sector}</p>}
            </div>

            <div>
              <label className="block mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.startDate && <p className="text-red-500 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block mb-1">End Date (within 5 days) *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.endDate && <p className="text-red-500 mt-1">{errors.endDate}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block mb-1">Reason for Fundraising *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                disabled={isSubmitting}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.reason && <p className="text-red-500 mt-1">{errors.reason}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/startup")}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !walletInfo.connected}
              className="px-6 py-2 bg-green-600 text-white rounded flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting && <div className="animate-spin h-4 w-4 border-b-2 mr-2"></div>}
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-800">Blockchain Integration</h4>
            <p className="text-blue-700 text-sm mt-1">
              Upon submission, a smart contract deploys on-chain. Ensure your wallet has enough ETH for gas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProject;
