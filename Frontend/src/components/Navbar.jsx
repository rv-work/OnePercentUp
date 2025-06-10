import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart, Menu, X, TrendingUp, UserPlus, LogIn, Target, Home, Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthConetx' 
import axios from 'axios' 
import toast from 'react-hot-toast'

const ModernNavbar = () => {
  const { isLoggedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate() 

  const toggleMenu = () => setIsOpen(!isOpen)

  const {setIsLoggedIn} = useAuth()

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      })
      if (res.data.success) {
        setIsLoggedIn(false)
        toast.success("Logged out successfully")
        navigate("/login")
      }
    } catch (err) {
      toast.error("Failed to logout")
      console.error(err)
    }
  }

  const getNavItems = () => {
    const commonItems = [{ name: 'Home', href: '/', icon: Home }]

    if (isLoggedIn) {
      return [
        ...commonItems,
        { name: 'Roadmap', href: '/roadmap', icon: Activity },
        { name: 'Year Goal', href: '/set-year-end', icon: Target },
        { name: 'Todays Goal', href: '/today-goal', icon: TrendingUp },
        { name: 'Goal', href: '/set-goal', icon: Target },
        { name: 'Sathi', href: '/my-friend', icon: Heart },
      ]
    } else {
      return [
        ...commonItems,
        { name: 'Sign Up', href: '/signup', icon: UserPlus },
        { name: 'Login', href: '/login', icon: LogIn },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="relative bg-gradient-to-r z-50 from-blue-600 via-purple-600 to-teal-600 shadow-2xl backdrop-blur-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full border border-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                <TrendingUp className="h-8 w-8 text-white group-hover:animate-pulse" />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                OnePercent<span className="text-pink-400">+</span>
              </h1>
              <p className="text-sm text-purple-200 opacity-80 font-medium">Transform • Grow • Excel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group relative px-6 py-3 text-white/90 hover:text-white font-medium transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative">
                        {item.name}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-blue-200 group-hover:w-full transition-all duration-300"></div>
                      </span>
                    </div>
                  </Link>
                )
              })}

              {/* Logout Button */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-3 text-white/90 hover:text-white font-medium transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-3 text-white hover:text-blue-100 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-6 h-6 relative">
                <Menu className={`absolute inset-0 transform transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 transform transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center space-x-3 px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl border border-transparent hover:border-white/20 transition-all duration-300 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <IconComponent className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.name}</span>
                  <div className="flex-1" />
                  <div className="w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              )
            })}

            {/* Logout Button - Mobile */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  handleLogout()
                }}
                className="w-full text-left flex items-center space-x-3 px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl border border-transparent hover:border-white/20 transition-all duration-300"
              >
                <LogIn className="h-6 w-6" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </nav>
  )
}

export default ModernNavbar
