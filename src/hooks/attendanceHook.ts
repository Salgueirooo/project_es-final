import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserDto } from '../dto/UsersDTO';

//falta trocar o url
// const useAttendance = (ucId: number, classId: number, userId: number) => {
//     const [attendance, setAttendance] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {

//         axios
//         .get(`http://localhost:8080/api/attendance/get/${ucId}/${classId}/${userId}`, {
//             headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         })
//         .then((response) => {
//             setAttendance(response.data);
//         })
//         .catch(() => {
//             setError('Error fetching curricular units.');
//         });
//     }, [ucId]);

//     return { attendance, error };
// };

const useAttendance = () => {
    const [attendance, setAttendance] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchAttendance = (ucId: number, classId: number, userId: number) => {
        axios
        .get(`http://localhost:8080/api/attendance/get/${ucId}/${classId}/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setAttendance(response.data);
        })
        .catch(() => {
            setError('Erro ao listar presenças.');
        });
    };

    return { attendance, error, fetchAttendance };
};

const useAttendances = (classId: number | null) => {
    const [attendance, setAttendance] = useState<UserDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchAttendance = async (classId: number) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/attendance/get-all-from-class/${classId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setAttendance(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setError("Error fetching attendance");
        }
    };

    useEffect(() => {
        if (classId) {
            fetchAttendance(classId);
            
        }
    }, [refreshKey]);

    const refreshAttendance = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return { attendance, error, refreshAttendance };
};

const updateAttendance = (ucId: number, classId: number, userId: number, refreshAttendance: () => void) => {
    axios.put(
        `http://localhost:8080/api/attendance/set/${ucId}/${classId}/${userId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    )
    .then(() => {
        console.log("Attendance updated!");
        refreshAttendance();
    })
    .catch(() => {
        console.error("Error updating attendance.");
    });
};

export { useAttendance, useAttendances, updateAttendance };