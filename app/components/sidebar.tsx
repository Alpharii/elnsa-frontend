import { NavLink, Outlet, redirect } from "@remix-run/react";
import { Home, LogOut, Users } from "lucide-react";

export default function PersonLayout() {
  const handleLogout = () => {
    document.cookie = "token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    return redirect("/auth/login");
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/person"
            className='flex items-center p-3 rounded-lg transition hover:bg-gray-800'
          >
            <Home className="w-5 h-5 mr-3" /> Home
          </NavLink>
          <NavLink
            to="/person"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" /> Person
          </NavLink>
          <NavLink
            onClick={handleLogout}
            to="/auth/login"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </NavLink>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
