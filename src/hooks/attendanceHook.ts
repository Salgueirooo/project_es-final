import { useState, useEffect } from 'react';
import { UserDto } from '../dto/UsersDTO';
import api from '../services/api';

const useAttendance = () => {
    const [attendance, setAttendance] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchAttendance = (ucId: number, classId: number) => {
        
        api
        .get(`/attendance/get/${ucId}/${classId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setAttendance(response.data);
            setError(null);
        })
        .catch(() => {
            setError("Erro ao listar presença.");
            console.error("Error fetching attendance.");
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
            const response = await api.get(
                `/attendance/get-all-from-class/${classId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setAttendance(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching attendances:", error);
            setError("Erro ao listar presenças.");
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
    api.put(
        `/attendance/set/${ucId}/${classId}/${userId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    )
    .then(() => {
        refreshAttendance();
    })
    .catch(() => {
        alert("Ocorreu um erro ao atualizar presença do aluno.");
        console.error("Error updating attendance.");
    });
};

export { useAttendance, useAttendances, updateAttendance };