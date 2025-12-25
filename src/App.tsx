import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import LearningPath from './pages/LearningPath';
import TopicPage from './pages/TopicPage';
import Playground from './pages/Playground';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<LearningPath />} />
            <Route path="topic/:topicId" element={<TopicPage />} />
            <Route path="playground" element={<Playground />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;