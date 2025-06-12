// import SignUp from "./components/signUp/SignUp.jsx";

import Navbar from "./components/landingPage/Navbar";
import HeroSection from "./components/landingPage/HeroSection";
import FeatureSection from "./components/landingPage/FeatureSection";
import Workflow from "./components/landingPage/Workflow";
import Footer from "./components/landingPage/Footer";
import Testimonials from "./components/landingPage/Testimonials";

const App = () => {
  return (
    <>
      <div className="">
        <Navbar />

        <div className="max-w-7xl mx-auto pt-20 px-6">
          <HeroSection />
          <FeatureSection />
          <Workflow />
          {/* <Pricing /> */}
          <Testimonials />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
