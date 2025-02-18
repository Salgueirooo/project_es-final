import { useState, useEffect } from 'react';
import { CurricularUnitDto } from '../dto/CurricularUnitDTO';
import api from '../services/api';

const useCurricularUnits = () => {
    const [curricularUnits, setCurricularUnits] = useState<CurricularUnitDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        api
        .get(`/curricular-units/session`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            setCurricularUnits(response.data);
            setError(null);
        })
        .catch(() => {
            setError('Erro ao listar Unidades Curriculares.');
        });
    }, []);

    return { curricularUnits, error };
};

export default useCurricularUnits;