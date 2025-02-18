import { useState, useEffect } from 'react';
import api from '../services/api';

const useUsername = () => {
    const [username, setUsername] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        api
        .get(`/users/user-name`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setUsername(response.data);
            setError(null);
        })
        .catch(() => {
            setError('Error fetching username.');
            console.error("Error fetching username.");
        });
    }, []);

    return { username, error };
};

export { useUsername };