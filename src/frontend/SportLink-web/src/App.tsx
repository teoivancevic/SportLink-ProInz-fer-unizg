// src/App.tsx
import { MantineProvider } from '@mantine/core';
import { Home } from './pages/Home';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <Home />
    </MantineProvider>
  );
}