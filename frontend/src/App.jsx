import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from "./pages/Form";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#048547", color: "white" }}>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>Form</Link>
        <Link to="/admin" style={{ color: "white" }}>Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
