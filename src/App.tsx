// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Arena from './Pages/Arena/Arena';
import LotteryPage from './Pages/Lottery/LotteryPage';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Arena" element={<Arena />} />
          <Route path="/LotteryPage" element={<LotteryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;