import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  TrendingUp,
  LogIn,
  Target,
  Home,
  Activity,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthConetx";
import axios from "axios";
import toast from "react-hot-toast";

const ModernNavbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Add subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "https://onepercentup.onrender.com/api/auth/logout",
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setIsLoggedIn(false);
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Failed to logout");
      console.error(err);
    }
  };

  const getNavItems = () => {
    const commonItems = [{ name: "Home", href: "/", icon: Home }];

    if (isLoggedIn) {
      return [
        ...commonItems,
        { name: "Roadmap", href: "/roadmap", icon: Activity },
        { name: "Year Goal", href: "/set-year", icon: Target },
        { name: "Today's Plan", href: "/todays-plan", icon: Calendar },
      ];
    } else {
      return [...commonItems];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent pt-4"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"} bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-purple-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                OnePercent<span className="text-purple-400">+</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2
                    ${
                      isActive
                        ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute top-24 left-4 right-4 bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 transition-all duration-300 origin-top ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
        >
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="h-px bg-white/10 my-4"></div>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 text-white bg-white/5 rounded-xl font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
