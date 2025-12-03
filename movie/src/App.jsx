import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import ToWatch from "./components/ToWatch";

export default function App() {
  return (
    <div className="towatch-section">
      <Routes>
        <Route path="/towatch" element={<ToWatch />} />
      </Routes>
    </div>
  );
}
