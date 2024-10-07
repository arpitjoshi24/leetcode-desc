import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './components/profile';
import Leader from './components/leader';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Leader />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
