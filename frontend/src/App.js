import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Utility/Navbar";
import DatabaseOverview from "./Pages/DatabaseOverview/FE_databaseOverview";
import Test from "./Pages/Test/Test";
import Persone from "./Pages/ArchivioPersone/FE_archivioPersone";
import ConfrontiPersone from "./Pages/ConfrontiPersone/FE_confrontiPersone"
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<DatabaseOverview />} />
        <Route path="/test" element={<Test />} />
        <Route path="/persone" element={<Persone />} />
         <Route path="/Confronti" element={<ConfrontiPersone />} />
      </Routes>
    </Router>
  );
}

export default App;