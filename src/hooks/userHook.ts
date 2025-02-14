import { useState, useEffect } from 'react';
import axios from 'axios';
//import { CurricularUnitDto } from '../dto/CurricularUnitDTO';
import { UserDto } from '../dto/UsersDTO';

const useUsername = () => {
    const [username, setUsername] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        axios
        .get(`http://localhost:8080/api/users/user-name`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setUsername(response.data);
        })
        .catch(() => {
            setError('Error fetching username.');
        });
    }, []);

    return { username, error };
};

const useUserId = () => {
    const [userId, setUserId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        axios
        .get(`http://localhost:8080/api/users/user-id`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setUserId(response.data);
        })
        .catch(() => {
            setError('Error fetching username.');
        });
    }, []);

    return { userId, error };
};

/*const useStudents = (ucId: number) => {
    const [students, setStudents] = useState<UserDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        axios
        .get(`http://localhost:8080/api/users/all-uc-students/${ucId}`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setStudents(response.data);
        })
        .catch(() => {
            setError('Error fetching username.');
        });
    }, [ucId]);

    return { students, error };
};*/

export { useUsername, useUserId/*, useStudents */};