import { Link, useLocation } from "react-router";

function FloatingButton() {
  const location = useLocation();
  const isInvestorPage = location.pathname.startsWith("/investor");

  return (
    <Link
      to={isInvestorPage ? "/investor/search" : "/add-project"}
      className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 z-10"
      aria-label={isInvestorPage ? "Search Projects" : "Add Project"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isInvestorPage ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        )}
      </svg>
    </Link>
  );
}

export default FloatingButton;
