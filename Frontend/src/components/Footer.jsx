import React from "react";
import {
  Target,
  Mail,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Brain,
  Shield,
  Clock,
  Users,
  ExternalLink,
  TrendingUp,
  Zap,
  ChevronRight,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

const ModernFooter = () => {
  const quickLinks = [
    { name: "About OnePercent+", href: "/about" },
    { name: "Start Your Journey", href: "/signup" },
    { name: "Login", href: "/login" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const services = [
    { name: "Life Goal Planning", href: "/life-goals" },
    { name: "AI Goal Breakdown", href: "/ai-planning" },
    { name: "Progress Tracking", href: "/tracking" },
    { name: "Personal AI Coach", href: "/ai-coach" },
    { name: "Daily Goal Manager", href: "/daily-goals" },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Github", href: "#", icon: Github },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
  ];

  return (
    <footer className="relative bg-[#030712] text-white overflow-hidden border-t border-white/5 pt-20">
      {/* Background Mesh Gradients */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none leading-none">
        <div className="absolute -bottom-[50%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]"></div>
        <div className="absolute -bottom-[50%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sleek Newsletter Section */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-[2rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 md:max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-4">
              <Zap className="w-3 h-3 text-yellow-400" /> AI-Powered Insights
            </div>
            <h3 className="text-3xl font-bold mb-3">Join the 1% Newsletter</h3>
            <p className="text-gray-400">
              Get weekly strategies on habit building, goal tracking, and
              productivity hacks directly in your inbox.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full sm:w-72 px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
              />
              <button className="px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                Subscribe{" "}
                <ExternalLink className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="items-center space-x-3 mb-6 group cursor-pointer inline-flex"
            >
              <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                OnePercent<span className="text-purple-400">+</span>
              </h2>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              The ultimate workspace for high-achievers. Set life goals, break
              them into daily actions, and let our AI system guide you to the
              top 1%.
            </p>

            {/* System Status */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              <span className="text-gray-300 text-xs font-medium">
                All systems operational
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="text-white font-semibold mb-6">Product</h3>
              <ul className="space-y-4">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      to={service.href}
                      className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-400 mr-1" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-400 mr-1" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-semibold mb-6">Connect</h3>
              <div className="space-y-4">
                <a
                  href="mailto:hello@onepercent.pro"
                  className="flex items-center space-x-3 text-sm text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>hello@onepercent.pro</span>
                </a>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Tech District, Innovation City</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} OnePercent+. Designed for the
            ambitious.
          </p>

          {/* Minimal Social Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
