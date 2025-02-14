import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface SecurityElem {
  allowedRoles: string[];
  children: JSX.Element;
}

const Security: React.FC<SecurityElem> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')?.trim(); // Remove any extra spaces
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Manage authorization state

  useEffect(() => {
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid token structure:', token);
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    let decodedToken: any;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    const userRole = decodedToken?.role;
    if (!userRole) {
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    const hasAccess = allowedRoles.some((role: string) => userRole.includes(role));

    if (!hasAccess) {
      navigate('/unauthorized'); // Redirect if role is not allowed
      setIsAuthorized(false); // Set unauthorized state
      return;
    }

    setIsAuthorized(true); // Set authorized state if role is valid
  }, []);

  if (isAuthorized) {
    return children;
  }

  return null;
};

export default Security;
