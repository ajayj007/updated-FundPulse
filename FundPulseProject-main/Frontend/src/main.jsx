import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import LoginInvestor from "./components/account/LoginInvestor.jsx";
import LoginStartup from "./components/account/LoginStartup.jsx";
import SignUpStartup from "./components/account/SignupStartup.jsx";
import SignUpInvestor from "./components/account/SignupInvestor.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddProject from "./pages/AddProject.jsx";
import BackProjects from "./pages/BackProjects.jsx";
import Chatbox from "./pages/Chatbox.jsx";
import CurrentProposal from "./pages/CurrentProposal.jsx";
import Profile from "./pages/Profile.jsx";
//
import InvestorDashboard from "./pages/investor/InvestorDashboard.jsx";
import InvestorProfile from "./pages/investor/InvestorProfile.jsx";
import SearchProjects from "./pages/investor/ExploreProjects.jsx";
import TrackInvestment from "./pages/investor/TrackInvestment.jsx";

//
import LayoutForMain from "./LayoutForMain.jsx";
//

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* landing page */}
      <Route path="" element={<App />} />
      {/* auth */}
      <Route path="startup-auth/signup" element={<SignUpStartup />} />
      <Route path="investor-auth/signup" element={<SignUpInvestor />} />
      <Route path="investor-auth/login" element={<LoginInvestor />} />
      <Route path="startup-auth/login" element={<LoginStartup />} />
      <Route path="dashboard" element={<Dashboard />} />

      {/* Startup Routes */}

      <Route path="/startup" element={<LayoutForMain />}>
        <Route path="/startup" element={<Dashboard />} />
        <Route path="/startup/add-project" element={<AddProject />} />
        <Route path="/startup/back-projects" element={<BackProjects />} />
        <Route path="/startup/current-proposal" element={<CurrentProposal />} />
        <Route path="/startup/profile" element={<Profile />} />
        <Route path="/startup/chatbox" element={<Chatbox />} />
      </Route>
      {/* Investor Routes */}
      <Route path="/investor" element={<LayoutForMain />}>
        <Route path="/investor" element={<InvestorDashboard />} />
        <Route path="/investor/track" element={<TrackInvestment />} />
        <Route path="/investor/explore" element={<SearchProjects />} />
        <Route path="/investor/profile" element={<InvestorProfile />} />
        <Route path="/investor/chatbox" element={<Chatbox />} />
      </Route>
    </Route>
  )
);

{
  /* <Route path="" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="user/:userid" element={<User />} />
      <Route path="github" element={<Github />} loader={githubInfo} /> */
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
