import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatsDto } from '../dto/StatsDTO';
import { AttendanceDto } from '../dto/AttendanceDTO';

const statsAttendace = () => {
    const [stats, setStats] = useState<StatsDto | null>(null);
    const [statsTeacher, setStatsTeacher] = useState<number>(0.0);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (ucId: number | null, isAdmin: boolean) => {
        if (!ucId) return;

        try {
            if (!isAdmin) {
                const response = await axios.get(
                    `http://localhost:8080/api/stats/get-total-classes-and-times-attended/${ucId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setStats(response.data);
            } else {
                const response = await axios.get(
                    `http://localhost:8080/api/stats/get-average-students-attended-per-class/${ucId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setStatsTeacher(response.data);
            }
        } catch (error) {
            setError("Erro ao obter estatísticas.");
        }
    };

    return { stats, statsTeacher, error, fetchStats };
};

const useNStudents = () => {
    const [nStudents, setNStudents] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const fetchNStudents = async (ucId: number | null) => {
        if (!ucId) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/api/stats/get-total-registered-students/${ucId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setNStudents(response.data);
        } catch (error) {
            setError("Erro ao obter número de alunos.");
        }
    };

    return { nStudents, error, fetchNStudents };
};

const processAttendanceData = (attendanceArray: AttendanceDto[]): AttendanceDto[] => {
    return attendanceArray.map((attendance, index) => ({
        ...attendance,
        nclass: `Aula n.º${index + 1}`, // Formata como "Aula 1", "Aula 2", etc.
    }));
};

const useAttendPerClass = () => {
    const [attendancesPerClass, setAttendancesPerClass] = useState<AttendanceDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendPClass = async (ucId: number | null) => {
        if (!ucId) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/api/stats/get-total-attended-to-classes-from-uc/${ucId}`,
                { headers: 
                    { Authorization: `Bearer ${localStorage.getItem("token")}` } 
                }
            );
            const processedData = processAttendanceData(response.data);
            setAttendancesPerClass(processedData);
        } catch (error) {
            setError("Erro ao obter número de alunos.");
        }
    };

    return { attendancesPerClass, error, fetchAttendPClass };
}

export { statsAttendace, useNStudents, useAttendPerClass };