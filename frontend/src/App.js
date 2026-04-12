import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Utility/Navbar";
import NuovaPagina from "./Pages/DatabaseOverview/FE_databaseOverview";
import Test from "./Pages/Test/Test";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/nuova" element={<NuovaPagina />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;