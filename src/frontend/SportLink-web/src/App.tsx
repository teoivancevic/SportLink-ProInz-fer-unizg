// src/App.tsx
import { MantineProvider } from '@mantine/core';
import { Home } from './pages/Home';
import { Login } from './pages/Login'
import { Registration } from './pages/Registration';
import '@mantine/core/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ProtectedRoute } from './components/ProtectedRoute';
import Logout from './components/authentication/Logout'; // Import the Logout component
import { OrganizationForm } from './pages/OrganizationForm';
import { AuthCallback } from './components/authentication/AuthCallback';
import { AdminOrganizations } from './pages/AdminOrganizations';



export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/registration/" element={<Registration/>} />
          <Route path="/registration/:step" element={<Registration/>} />
          <Route path="/registerOrganisation" element={<OrganizationForm />} />
          <Route path="/adminOrganizations" element={<AdminOrganizations />} />
          {/* <Route path="/authorized" element={<ProtectedRoute><AuthorizedHome /></ProtectedRoute>} /> */}
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}