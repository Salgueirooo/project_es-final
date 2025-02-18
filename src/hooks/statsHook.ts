import { useState } from 'react';
import { StatsDto } from '../dto/StatsDTO';
import { AttendanceDto } from '../dto/AttendanceDTO';
import api from '../services/api';

const statsAttendace = () => {
    const [stats, setStats] = useState<StatsDto | null>(null);
    const [statsTeacher, setStatsTeacher] = useState<number>(0.0);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (ucId: number | null, isAdmin: boolean) => {

        try {
            if (!isAdmin) {
                const response = await api.get(
                    `/stats/get-total-classes-and-times-attended/${ucId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setStats(response.data);
            } else {
                const response = await api.get(
                    `/stats/get-average-students-attended-per-class/${ucId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setStatsTeacher(response.data);
            }
            setError(null);
        } catch (error) {
            console.error("Erro ao obter estatisticas:", error);
            setError("Erro ao obter estatísticas.");
        }
    };

    return { stats, statsTeacher, error, fetchStats };
};

const useNStudents = () => {
    const [nStudents, setNStudents] = useState<number>(0);

    const fetchNStudents = async (ucId: number | null) => {

        try {
            const response = await api.get(
                `/stats/get-total-registered-students/${ucId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setNStudents(response.data);
        } catch (error) {
            console.error("Erro ao procurar alunos inscritos na UC:", error);
        }
    };

    return { nStudents, fetchNStudents };
};

const processAttendanceData = (attendanceArray: AttendanceDto[]): AttendanceDto[] => {
    return attendanceArray.map((attendance, index) => ({
        ...attendance,
        nclass: `Aula n.º${index + 1}`,
    }));
};

const useAttendPerClass = () => {
    const [attendancesPerClass, setAttendancesPerClass] = useState<AttendanceDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendPClass = async (ucId: number | null) => {

        try {
            const response = await api.get(
                `/stats/get-total-attended-to-classes-from-uc/${ucId}`,
                { headers: 
                    { Authorization: `Bearer ${localStorage.getItem("token")}` } 
                }
            );
            const processedData = processAttendanceData(response.data);
            setAttendancesPerClass(processedData);
        } catch (error) {
            setError("Erro ao obter número de alunos.");
            console.error("Erro ao obter número de alunos:", error);
        }
    };

    return { attendancesPerClass, error, fetchAttendPClass };
}

export { statsAttendace, useNStudents, useAttendPerClass };