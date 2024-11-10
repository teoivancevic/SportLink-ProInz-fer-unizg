// src/App.tsx
import { MantineProvider } from '@mantine/core';
import { Home } from './pages/Home';
import { Login } from './pages/Login'
import { Registration } from './pages/Registration';
import '@mantine/core/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/registration/" element={<Registration/>} />
          <Route path="/registration/:step" element={<Registration/>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}