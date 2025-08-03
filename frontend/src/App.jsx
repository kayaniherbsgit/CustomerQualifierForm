import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./pages/Form";
import FormQuiz from "./pages/FormQuiz";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/admin" element={<Admin />} />
               <Route path="/quiz" element={<FormQuiz />} />  
      </Routes>
    </Router>
  );
}
