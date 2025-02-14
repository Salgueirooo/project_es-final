import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurricularUnitDto } from '../dto/CurricularUnitDTO';

const useCurricularUnits = () => {
    const [curricularUnits, setCurricularUnits] = useState<CurricularUnitDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        axios
        .get(`http://localhost:8080/api/curricular-units/session`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setCurricularUnits(response.data);
        })
        .catch(() => {
            setError('Erro ao listar Unidades Curriculares.');
        });
    }, []);

    return { curricularUnits, error };
};

export default useCurricularUnits;