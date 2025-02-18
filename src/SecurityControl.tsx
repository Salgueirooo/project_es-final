import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface SecurityElem {
  allowedRoles: string[];
  children: JSX.Element;
}

const Security: React.FC<SecurityElem> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')?.trim();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid token structure:', token);
      alert("Token inválido!");
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    let decodedToken: any;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      alert("Token inválido!");
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    const userRole = decodedToken?.role;
    if (!userRole) {
      alert("Cargo não encontrado!");
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    const hasAccess = allowedRoles.some((role: string) => userRole.includes(role));
    if (!hasAccess) {
      alert("Cargo não permitido!");
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, []);

  if (isAuthorized) {
    return children;
  }

  return null;
};

export default Security;
