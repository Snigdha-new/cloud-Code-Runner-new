import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import EditorPage from "./EditorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;