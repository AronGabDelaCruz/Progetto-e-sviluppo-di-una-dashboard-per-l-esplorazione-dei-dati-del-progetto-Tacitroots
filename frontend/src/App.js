import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Utility/Navbar";
import DatabaseOverview from "./Pages/DatabaseOverview/FE_databaseOverview";
import Test from "./Pages/Test/Test";
import Persone from "./Pages/ArchivioPersone/FE_archivioPersone";
import ConfrontiPersone from "./Pages/ConfrontiPersone/FE_confrontiPersone";
import Esperimenti from "./Pages/Esperimenti/FE_esperimenti"
import Footer from "./Utility/Footer";
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/Database" element={<DatabaseOverview />} />
        <Route path="/" element={<Persone />} />
        <Route path="/Confronti" element={<ConfrontiPersone />} />
        <Route path="/Esperimenti" element={<Esperimenti />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;