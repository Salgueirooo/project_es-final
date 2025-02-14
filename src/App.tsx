import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/homePage';
import Security from './SecurityControl';

const App: React.FC = () => {
  
  const roles = ["ROLE_ADMIN", "ROLE_USER"];
  
  return (
    <Routes>
      
      <Route path="/" element={<LoginPage />} />
      
      <Route
        path="/home"
        element={
          <Security allowedRoles={roles}>
            <HomePage />
          </Security>
        }
      />

    </Routes>
  );
};

export default App;
