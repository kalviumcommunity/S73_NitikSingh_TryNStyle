import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/admin" element={<AdminDashboard/>} />

        
      </Routes>
    </Router>
  );
}

export default App;
