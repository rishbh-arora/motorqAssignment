import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Dashboard from './components/Dashboard';
import Metrics from './components/Metrics';
import Driver from './components/forms/driver';

function App() {

  const menus = [
    { "name": "Dashboard", code: 0 },
    { "name": "Metrics", code: 1 },
  ]
  // const [menu, setMenu] = useState(menus[0]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard menus={menus} />} />
        <Route path="/dashboard" element={<Dashboard menus={menus} />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/driver" element={<Driver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
