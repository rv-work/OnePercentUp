import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Activity,
  Shield,
  Star,
  Calendar,
  BarChart,
  ChevronRight,
  Play,
  Globe,
} from "lucide-react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ users: 0, goals: 0, success: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Animated Stats
  useEffect(() => {
    setIsVisible(true);
    const targetStats = { users: 10247, goals: 25683, success: 89 };
    const duration = 2000;
    const steps = 60;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        users: Math.floor(targetStats.users * progress),
        goals: Math.floor(targetStats.goals * progress),
        success: Math.floor(targetStats.success * progress),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
  }, []);

  // Auto-play testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      text: "The bento analytics dashboard is insane. I've never been this consistent with my coding goals.",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "Startup Founder",
      text: "OnePercent+ replaced 3 different apps for me. The community aspect keeps my dopamine in check.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      role: "Product Designer",
      text: "Visually stunning and incredibly effective. Achieving my daily targets feels like a game now.",
      rating: 5,
    },
  ];

  const timeline = [
    {
      icon: Target,
      title: "Set Your Master Vision",
      desc: "Define your long-term goals. Our AI breaks them down into actionable daily tasks.",
    },
    {
      icon: Calendar,
      title: "Daily Execution",
      desc: "Log in every day to check off your micro-habits. Build a streak that you won't want to break.",
    },
    {
      icon: BarChart,
      title: "Analyze & Adapt",
      desc: "Review your weekly heatmaps and performance metrics to optimize your routine.",
    },
    {
      icon: Sparkles,
      title: "Transform",
      desc: "Look back after 6 months and realize you've completely reinvented your life.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-purple-500/30 overflow-x-hidden pb-20">
      {/* Background Meshes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[150px] animate-pulse"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[150px] animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div
          className={`max-w-7xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              OnePercent+ v2.0 is Live
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Architect Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ultimate Future.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            Stop relying on motivation. Build a relentless system. Track daily
            habits, crush massive goals, and join a community of high-achievers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              Start Your Journey{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> See How It Works
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-y border-white/10 py-10 bg-white/[0.02] backdrop-blur-sm rounded-3xl">
            <div>
              <div className="text-4xl font-black text-white mb-1">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" /> Active Achievers
              </div>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
              <div className="text-4xl font-black text-white mb-1">
                {stats.goals.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium flex items-center justify-center gap-2">
                <Target className="w-4 h-4" /> Goals Crushed
              </div>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-1">
                {stats.success}%
              </div>
              <div className="text-gray-400 font-medium flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" /> Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Bento Grid Features */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-purple-400">dominate</span>
            </h2>
            <p className="text-gray-400 text-lg">
              A complete ecosystem designed for your personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feature - Large */}
            <div className="md:col-span-2 group p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-all relative overflow-hidden flex flex-col justify-between h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="p-3 bg-purple-500/20 w-fit rounded-2xl mb-6">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  Deep Analytics Engine
                </h3>
                <p className="text-gray-400 max-w-md">
                  Visualize your consistency. Our heatmaps and progress charts
                  turn your hard work into beautiful, addictive data.
                </p>
              </div>

              {/* Mock UI Element */}
              <div className="relative z-10 bg-[#0a0a0f] border border-white/10 rounded-xl p-4 mt-8 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Weekly Progress</div>
                    <div className="text-xl font-bold text-white">
                      85% Completed
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-sm bg-purple-500"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Feature - Square 1 */}
            <div className="group p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-indigo-500/50 transition-all h-[400px] flex flex-col">
              <div className="p-3 bg-indigo-500/20 w-fit rounded-2xl mb-6">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Micro-Goals</h3>
              <p className="text-gray-400 mb-8 flex-grow">
                Big dreams are overwhelming. We break them into daily
                checklists.
              </p>

              {/* Mock UI Checklist */}
              <div className="space-y-3 bg-[#0a0a0f] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm text-gray-300 line-through opacity-50">
                    Morning Workout
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30"></div>
                  <span className="text-sm text-white">Read 10 Pages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30"></div>
                  <span className="text-sm text-white">Deep Work (2 hrs)</span>
                </div>
              </div>
            </div>

            {/* Feature - Square 2 */}
            <div className="group p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-pink-500/50 transition-all h-[400px] flex flex-col">
              <div className="p-3 bg-pink-500/20 w-fit rounded-2xl mb-6">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Elite Circle</h3>
              <p className="text-gray-400 mb-8 flex-grow">
                Connect, compete, and grow with people who push you to be
                better.
              </p>

              {/* Mock UI Avatars */}
              <div className="flex items-center justify-center p-4 bg-[#0a0a0f] border border-white/10 rounded-xl">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br flex items-center justify-center font-bold text-white shadow-lg z-${10 - i} hover:-translate-y-2 transition-transform cursor-pointer ${i % 2 === 0 ? "from-pink-500 to-purple-500" : "from-indigo-500 to-blue-500"}`}
                    >
                      U{i}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0f] bg-white/10 flex items-center justify-center text-xs font-bold text-white backdrop-blur-sm z-0">
                    +99
                  </div>
                </div>
              </div>
            </div>

            {/* Feature - Wide Bottom */}
            <div className="md:col-span-2 group p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row items-center justify-between gap-8 h-auto md:h-[250px]">
              <div>
                <div className="p-3 bg-emerald-500/20 w-fit rounded-2xl mb-6">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Bulletproof System</h3>
                <p className="text-gray-400 max-w-md">
                  Our methodology is based on proven behavioral psychology. We
                  don't just track; we ensure you build habits that stick
                  forever.
                </p>
              </div>
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400 transition-all whitespace-nowrap">
                Explore Roadmap <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The Path to <span className="text-indigo-400">1%</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Four steps to completely rewire your routine.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-indigo-500/50 before:to-transparent">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#030712] bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>

                {/* Content Box */}
                <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-white">
                      {item.title}
                    </h3>
                    <span className="text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="relative z-10 py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Wall of <span className="text-pink-400">Wins</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Real stories from the 1% club.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className={`p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 transition-all duration-500 ${index === activeTestimonial ? "shadow-[0_0_30px_rgba(236,72,153,0.15)] border-pink-500/30 transform -translate-y-2" : "hover:border-white/20"}`}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-pink-500 text-pink-500"
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-lg mb-8 italic">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{test.name}</h4>
                    <p className="text-sm text-gray-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Massive Bottom CTA */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[3rem] p-12 md:p-20 text-center overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
            {/* CTA Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Stop Waiting for the <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Perfect Moment.
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                The time will never be just right. Start where you stand, and
                work with whatever tools you may have at your command.
              </p>

              <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] flex items-center gap-3 mx-auto">
                <Zap className="w-6 h-6" /> Join for Free Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
