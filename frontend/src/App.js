import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Utility/Navbar";
import DatabaseOverview from "./Pages/DatabaseOverview/FE_databaseOverview";
import Test from "./Pages/Test/Test";
import Persone from "./Pages/ArchivioPersone/FE_archivioPersone";
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/nuova" element={<DatabaseOverview />} />
        <Route path="/test" element={<Test />} />
        <Route path="/persone" element={<Persone />} />
      </Routes>
    </Router>
  );
}

export default App;