import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Roadmap from './pages/Roadmap';
import SetGoal from './pages/SetGoal';
import YearSet from './pages/YearSet';
import MyFriend from './pages/MyFriend';
import TodaysGoal from './pages/TodaysGoal';
import ModernNavbar from './components/Navbar';
import ModernFooter from './components/Footer';

function App() {
  return (
    <div>
      <ModernNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/today-goal" element={<TodaysGoal/>} />
      <Route path="/set-goal" element={<SetGoal />} />
      <Route path="/set-year-end" element={<YearSet />} />
      <Route path="/my-friend" element={<MyFriend />} />
    </Routes>
    <ModernFooter />
    </div>
  );
}

export default App;
