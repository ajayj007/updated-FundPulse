import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "/assets/logo.png";
import { navItems } from "../../constants";
import { NavLink } from "react-router-dom";

const Navbar = ({ onPopupToggle = () => {} }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (popup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [popup]);

  const popupLinks = {
    Signup: [
      { name: "Create as Startup", path: "/startup-auth/signup" },
      { name: "Create as Investor", path: "/investor-auth/signup" },
    ],
    Login: [
      { name: "Sign in as Startup", path: "/startup-auth/login" },
      { name: "Sign in as Investor", path: "/investor-auth/login" },
    ],
  };

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handlePopupToggle = (popupType) => {
    setPopup(popupType);
    onPopupToggle(!!popupType);
    setMobileDrawerOpen(false); // Close the mobile drawer when a popup is opened
  };

  return (
    <>
      <AnimatePresence>
        {popup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => handlePopupToggle(null)}
          >
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white/90 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl shadow-black/30 w-11/12 max-w-md z-50 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handlePopupToggle(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X size={24} />
              </button>
              <h3 className="text-gray-800 font-semibold text-center text-2xl mb-6">{popup}</h3>
              <div className="space-y-4">
                {popupLinks[popup].map(({ name, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40"
                  >
                    {name}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
        <div className="container px-4 mx-auto relative lg:text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-shrink-0">
              <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
              <span className="text-xl tracking-tight font-bold">FundPulse</span>
            </div>
            <ul className="hidden lg:flex ml-14 space-x-12 font-bold">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="hidden lg:flex justify-center space-x-6 items-center">
              <button
                onClick={() => handlePopupToggle("Login")}
                className="py-2 px-3 border rounded-md cursor-pointer hover:bg-gray-100 transition duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => handlePopupToggle("Signup")}
                className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md cursor-pointer hover:from-orange-600 hover:to-orange-900 transition duration-300"
              >
                Create an Account
              </button>
            </div>
            <div className="lg:hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
            </div>
          </div>
          {mobileDrawerOpen && (
            <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden text-white">
              <ul>
                {navItems.map((item, index) => (
                  <li key={index} className="py-4">
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-6 mt-4">
                <button
                  onClick={() => handlePopupToggle("Login")}
                  className="py-2 px-3 border rounded-md hover:bg-gray-100 transition duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handlePopupToggle("Signup")}
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-600 hover:to-orange-900 transition duration-300"
                >
                  Create an Account
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
