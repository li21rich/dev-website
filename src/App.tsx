import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Navbar from "./components/Navbar"
import type { NavLinkItem } from "./components/Navbar";
import Cursor from "./components/Cursor";
const navLinks: NavLinkItem[] = [
  { id: "1", title: "home", to: "/" },
  { id: "3", title: "resume", to: "/resume", button: true },
];
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Navbar links={navLinks}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </Router>
      <Cursor />
    </div>
  );
};

export default App;
