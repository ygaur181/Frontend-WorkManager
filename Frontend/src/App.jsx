import WorkAll from '../components/workAll';
import WorkDetail from '../components/workDetail';
import WorkOverview from '../components/workOverview';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<WorkOverview />} />
          <Route path="/detail" element={<WorkDetail />} />
          <Route path="/detail/:id" element={<WorkDetail />} />
          <Route path="/all" element={<WorkAll />} />
        </Routes>
    </Router>
  );
}

export default App;
