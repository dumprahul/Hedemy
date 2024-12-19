import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './components/Course';
import ProposeDAO from './components/ProposeDAO';
import Stake from './components/Stake';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/proposeDAO" element={<ProposeDAO />} />
          <Route exact path="/course" element={<Course />} />
          <Route exact path="/stake" element={<Stake />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
