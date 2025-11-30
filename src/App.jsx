import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Fields from "./pages/Fields";
import FieldDetail from "./pages/FieldDetail";
import RedEngineers from "./pages/RedEngineers";
import CaseDetail from "./pages/CaseDetail";
import EngineerStory from "./pages/EngineerStory";
import EngineerAchievements from "./pages/EngineerAchievements";
import Enterprises from "./pages/Enterprises";
import Spirits from "./pages/Spirits";
import RedSpirit from "./pages/RedSpirit";
import Platforms from "./pages/Platforms";
import Personalized from "./pages/Personalized";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/fields/:fieldId" element={<FieldDetail />} />
        <Route path="/red-engineers" element={<RedEngineers />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/engineer-stories/:engineerId" element={<EngineerStory />} />
        <Route
          path="/engineer-achievements/:engineerId"
          element={<EngineerAchievements />}
        />
        <Route path="/enterprises" element={<Enterprises />} />
        <Route path="/spirits" element={<Spirits />} />
        <Route path="/red-spirit" element={<RedSpirit />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/personalized" element={<Personalized />} />
      </Routes>
    </div>
  );
}

export default App;
