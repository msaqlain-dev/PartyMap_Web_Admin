import { Link, useLocation } from "react-router-dom";
import useUIStore from "../store/uiStore";
import { partyMapBranding } from "../assets/images";
import { DashboardIcon, MarkerIcon, GrowthIcon, SettingIcon } from "../assets/icons";

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { name: "Markers", path: "/markers", icon: <MarkerIcon /> },
    { name: "Customers", path: "/customers", icon: <GrowthIcon /> },
    { name: "Settings", path: "/settings", icon: <SettingIcon /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img src={partyMapBranding} width={200} alt="" />
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={partyMapBranding} alt="" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
