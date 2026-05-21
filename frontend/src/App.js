import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Utility/Navbar";
import DatabaseOverview from "./Pages/DatabaseOverview/FE_databaseOverview";
import Persone from "./Pages/ArchivioPersone/FE_archivioPersone";
import ConfrontiPersone from "./Pages/ConfrontiPersone/FE_confrontiPersone";
import Esperimenti from "./Pages/Esperimenti/FE_esperimenti"
import Temi from "./Pages/TemiDiDiscussione/FE_temiDiDIscussione"
import Strumenti from "./Pages/Strumenti/FE_strumenti";
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
        <Route path="/Temi" element={<Temi />} />
        <Route path="/Strumenti" element={<Strumenti />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;