import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Roadmap from "./pages/Roadmap";
import YearSet from "./pages/YearSet";
import ModernNavbar from "./components/Navbar";
import ModernFooter from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-purple-500/30">
      <ModernNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/set-year" element={<YearSet />} />
      </Routes>
      <ModernFooter />
    </div>
  );
}

export default App;
