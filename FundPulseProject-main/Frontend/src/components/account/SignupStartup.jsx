import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function SignUpStartup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    founderName: "",
    email: "",
    countryCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // industryCategories: '',
    // fundingGoal: 0,
    currency: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/startup/signup`,
        {
          founderName: formData.founderName,
          email: formData.email,
          countryCode: formData.countryCode,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          // industryCategories: formData.industryCategories,
          // fundingGoal: formData.fundingGoal,
          currency: formData.currency,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("startupId", response.data.startupId);
      console.log("Signup successful:", response.data);
      setFormData({
        founderName: "",
        email: "",
        countryCode: "",
        phone: "",
        password: "",
        confirmPassword: "",
        // industryCategories: "",
        // fundingGoal: "",
        currency: "",
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://wallpaperaccess.com/full/7667052.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <h2 className="mt-6 text-2xl font-bold text-black sm:text-3xl md:text-4xl">
              Welcome to FundPulse
            </h2>

            <p className="mt-4 text-xl leading-relaxed text-black">
              A place for budding startups to thrive in this capilistic world of business.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20 dark:bg-gray-900"
                href="#"
              >
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                Welcome to FundPulse
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                A place for budding startups to thrive in this capilistic world of business.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="FounderName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Founder Name
                </label>

                <input
                  type="text"
                  id="FounderName"
                  name="founderName"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8"
                  value={formData.founderName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Phone Number
                </label>

                <div className="flex mt-1">
                  <select
                    name="countryCode"
                    className="rounded-l-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 px-2 h-8"
                    value={formData.countryCode}
                    onChange={handleChange}
                  >
                    <option value="">Select your country</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+973">+973 (Bahrain)</option>
                    <option value="+880">+880 (Bangladesh)</option>
                    <option value="+32">+32 (Belgium)</option>
                    <option value="+55">+55 (Brazil)</option>
                    <option value="+86">+86 (China)</option>
                    <option value="+56">+56 (Chile)</option>
                    <option value="+420">+420 (Czech Republic)</option>
                    <option value="+20">+20 (Egypt)</option>
                    <option value="+372">+372 (Estonia)</option>
                    <option value="+358">+358 (Finland)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+62">+62 (Indonesia)</option>
                    <option value="+98">+98 (Iran)</option>
                    <option value="+964">+964 (Iraq)</option>
                    <option value="+962">+962 (Jordan)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+965">+965 (Kuwait)</option>
                    <option value="+856">+856 (Laos)</option>
                    <option value="+961">+961 (Lebanon)</option>
                    <option value="+60">+60 (Malaysia)</option>
                    <option value="+52">+52 (Mexico)</option>
                    <option value="+373">+373 (Moldova)</option>
                    <option value="+212">+212 (Morocco)</option>
                    <option value="+31">+31 (Netherlands)</option>
                    <option value="+64">+64 (New Zealand)</option>
                    <option value="+47">+47 (Norway)</option>
                    <option value="+968">+968 (Oman)</option>
                    <option value="+92">+92 (Pakistan)</option>
                    <option value="+51">+51 (Peru)</option>
                    <option value="+63">+63 (Philippines)</option>
                    <option value="+48">+48 (Poland)</option>
                    <option value="+7">+7 (Russia)</option>
                    <option value="+966">+966 (Saudi Arabia)</option>
                    <option value="+65">+65 (Singapore)</option>
                    <option value="+27">+27 (South Africa)</option>
                    <option value="+82">+82 (South Korea)</option>
                    <option value="+34">+34 (Spain)</option>
                    <option value="+94">+94 (Sri Lanka)</option>
                    <option value="+46">+46 (Sweden)</option>
                    <option value="+41">+41 (Switzerland)</option>
                    <option value="+66">+66 (Thailand)</option>
                    <option value="+90">+90 (Turkey)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+84">+84 (Vietnam)</option>
                  </select>

                  <input
                    type="tel"
                    id="Phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="w-full rounded-r-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 h-8"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="col-span-6">
                <label
                  htmlFor="InvestmentCategory"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Investment Category
                </label>

                <select
                  id="IndustryCategories"
                  name="industryCategories"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 px-2"
                  value={formData.industryCategories}
                  onChange={handleChange}
                >
                  <option value="">Select an industry category</option>
                  <option value="stocks">Stocks</option>
                  <option value="bonds">Bonds</option>
                  <option value="mutual_funds">Mutual Funds</option>
                  <option value="etfs">Exchange-Traded Funds (ETFs)</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="gold">Gold & Precious Metals</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="private_equity">Private Equity</option>
                  <option value="venture_capital">Venture Capital</option>
                  <option value="hedge_funds">Hedge Funds</option>
                  <option value="fixed_deposits">Fixed Deposits</option>
                  <option value="reit">Real Estate Investment Trusts (REITs)</option>
                  <option value="commodities">Commodities</option>
                  <option value="art_collectibles">Art & Collectibles</option>
                  <option value="forex">Foreign Exchange (Forex)</option>
                  <option value="startups">Startups & Angel Investing</option>
                  <option value="peer_to_peer_lending">Peer-to-Peer Lending</option>
                  <option value="insurance">Insurance & Annuities</option>
                  <option value="retirement_funds">Retirement Funds (401k, IRA, NPS, etc.)</option>
                  <option value="alternative_investments">Alternative Investments</option>
                </select>
              </div> */}

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password Confirmation
                </label>

                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="confirmPassword"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="col-span-6">
                <label
                  htmlFor="fundingGoal"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Funding Goal
                </label>

                <div className="mt-1 flex">
                  <input
                    type="number"
                    id="fundingGoal"
                    name="fundingGoal"
                    placeholder="Enter amount"
                    className="w-3/4 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 px-2"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                  />

                  <select
                    id="currency"
                    name="currency"
                    className="w-1/4 ml-2 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 px-2"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="SGD">SGD (S$)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="CHF">CHF (Fr)</option>
                  </select>
                </div>
              </div> */}

              <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
                  />

                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    I want to receive emails about events, product updates and company
                    announcements.
                  </span>
                </label>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our
                  <a href="#" className="text-gray-700 underline dark:text-gray-200 ml-1 mr-1">
                    terms and conditions
                  </a>
                  and
                  <a href="#" className="text-gray-700 underline dark:text-gray-200 ml-1">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div className="flex-col col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden dark:hover:bg-blue-700 dark:hover:text-white">
                  Create an account
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
                  Already have an account?{" "}
                  <NavLink
                    to="/startup-auth/login"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-400 transition"
                  >
                    Login
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default SignUpStartup;
