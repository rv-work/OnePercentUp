import  { useState } from 'react'
import { User, Mail, Lock, Phone, Calendar, Eye, EyeOff, Sparkles, Star, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate  , Link} from 'react-router-dom'
import { useAuth } from '../context/AuthConetx'

const Signup = () => {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    dob: ''
  })

  const {setIsLoggedIn} = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
  setIsLoading(true)

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!')
    setIsLoading(false)
    return
  }

  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    gender: formData.gender,
    dob: formData.dob
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 2000)) 

    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (data.success) {
      setIsLoggedIn(true)
      toast.success('Signup successful!')

      navigate('/set-goal')
    } else {
      toast.error(data.message || 'Signup failed.')
    }
  } catch (error) {
    console.error('Signup Error:', error)
    toast.error('Something went wrong. Please try again.')
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Star 
            key={i}
            className={`absolute text-white opacity-20 animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 10 + 10}px`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-bounce">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              1%UP
            </h1>
            <p className="text-xl text-gray-300 mb-2">Transform Your Life, One Day at a Time</p>
            <p className="text-gray-400">Join thousands on their journey to excellence</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-gray-300 cursor-pointer">Start your transformation journey today</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="relative group">
                  
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group">
                
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300" size={20} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                     
                      className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="relative group">
                  
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                   
                      className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative group">
             
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-300" size={20} />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Gender Field */}
                <div className="relative group">

                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    
                      className="w-full px-4 py-4 bg-transparent text-white focus:outline-none text-lg appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Gender</option>
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="relative group md:col-span-2">
                  <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300" size={20} />
                    <input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                     
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white focus:outline-none text-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="relative group mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-4 rounded-xl text-lg font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Creating Your Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Your Journey</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-white/20">
              <p className="text-gray-300">
                Already have an account? 
                <Link 
                 to="/login"
                className="text-purple-400 hover:text-purple-300 cursor-pointer font-semibold ml-1">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Personalized Growth</h3>
              <p className="text-gray-400 text-sm">Tailored plans for your unique journey</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-400 text-sm">Learn from the best in the industry</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-white" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-400 text-sm">Join 10,000+ successful members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup