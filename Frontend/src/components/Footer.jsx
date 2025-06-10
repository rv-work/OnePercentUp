import { Target, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Brain, Shield, Clock, Users, ChevronRight, ExternalLink, TrendingUp, Award, Star, Zap, Calendar, BarChart3, Bot, Lightbulb } from 'lucide-react'

const ModernFooter = () => {
  const quickLinks = [
    { name: 'About GoalMaster', href: '/about', icon: Users },
    { name: 'Start Your Journey', href: '/signup', icon: Target },
    { name: 'Login', href: '/login', icon: ChevronRight },
    { name: 'AI Features', href: '/ai-features', icon: Brain },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Terms of Service', href: '/terms', icon: ChevronRight },
  ]

  const services = [
    { name: 'Life Goal Planning', href: '/life-goals', icon: Target },
    { name: 'AI Goal Breakdown', href: '/ai-planning', icon: Brain },
    { name: 'Progress Tracking', href: '/tracking', icon: BarChart3 },
    { name: 'Personal AI Coach', href: '/ai-coach', icon: Bot },
    { name: 'Daily Goal Manager', href: '/daily-goals', icon: Calendar },
    { name: '24/7 AI Support', href: '/support', icon: Clock },
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook, color: 'hover:bg-blue-600' },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: 'hover:bg-sky-500' },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram, color: 'hover:bg-pink-600' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin, color: 'hover:bg-blue-700' },
  ]

  const growthStats = [
    { label: 'Goals Achieved', value: '500K+', icon: Target, color: 'text-green-300' },
    { label: 'Active Dreamers', value: '50K+', icon: Users, color: 'text-blue-300' },
    { label: 'AI Conversations', value: '1M+', icon: Bot, color: 'text-purple-300' },
    { label: 'Success Rate', value: '87%', icon: TrendingUp, color: 'text-yellow-300' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 animate-pulse"></div>
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-3 rounded-full border border-white/20 group-hover:scale-110 transition-all duration-300">
                  <Target className="h-8 w-8 text-white group-hover:text-blue-200" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  GoalMaster Pro
                </h2>
                <p className="text-xs text-blue-200 opacity-80">AI-Powered Goal Achievement</p>
              </div>
            </div>
            
            <p className="text-white/80 text-base leading-relaxed mb-6">
              Transform your dreams into achievable milestones with AI-powered planning. Set life goals, get personalized roadmaps, and track your journey to success with your personal AI coach.
            </p>

            {/* Growth Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {growthStats.map((stat) => {
                const IconComponent = stat.icon
                return (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-white font-bold text-lg">{stat.value}</span>
                    </div>
                    <p className="text-white/70 text-xs">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            {/* AI Status */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg border border-purple-300/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">AI Coach: Online</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="h-4 w-4 text-purple-300" />
                <span className="text-white/80 text-sm">Smart Goal Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-pink-300" />
                <span className="text-white/80 text-sm">24/7 Progress Tracking</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <ChevronRight className="h-5 w-5 text-blue-300" />
              <span>Quick Access</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="group flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all duration-300 border border-transparent hover:border-white/10"
                    >
                      <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-300" />
              <span>AI Features</span>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => {
                const IconComponent = service.icon
                return (
                  <li key={service.name}>
                    <a 
                      href={service.href} 
                      className="group flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all duration-300 border border-transparent hover:border-white/10"
                    >
                      <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{service.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Mail className="h-5 w-5 text-teal-300" />
              <span>Connect With Us</span>
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-white/80">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Email Support</p>
                  <p className="font-medium">hello@goalmaster.pro</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-white/80">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-lg">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-white/60">AI Coach</p>
                  <p className="font-medium">Chat with your personal AI</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-white/80">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Headquarters</p>
                  <p className="font-medium">Innovation District, Tech City</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-white/80 mb-4">Join our community</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:scale-110 transition-all duration-300 ${social.color}`}
                    >
                      <IconComponent className="h-5 w-5 text-white group-hover:text-white" />
                      <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Growth Newsletter */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-xs font-medium">AI-Powered</span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Brain className="h-8 w-8 text-purple-300" />
              <h3 className="text-2xl font-bold">Get Weekly AI Insights</h3>
            </div>
            <p className="text-white/80 max-w-2xl mx-auto">
              Receive personalized goal strategies, success stories from our community, and cutting-edge AI tips to accelerate your growth journey.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email for AI insights"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400/60 focus:bg-white/15 transition-all duration-300"
            />
            <button className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Subscribe</span>
              <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>10K+ subscribers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-blue-300" />
              <span>Weekly success tips</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-orange-300" />
              <span>AI strategies</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <p>© 2025 GoalMaster Pro. Powered by AI. Built for Dreamers.</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-white/60 hover:text-white transition-colors duration-300 flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </a>
              <a href="/terms" className="text-white/60 hover:text-white transition-colors duration-300">Terms</a>
              <a href="/ai-ethics" className="text-white/60 hover:text-white transition-colors duration-300 flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>AI Ethics</span>
              </a>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60">AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
    </footer>
  )
}

export default ModernFooter