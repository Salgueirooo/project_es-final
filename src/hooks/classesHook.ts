import { useState, useEffect } from 'react';
import axios from 'axios';
import { ClassesDto } from '../dto/ClassesDTO';
import api from '../services/api';

const useClasses = (unitId: number | null) => {
    const [classes, setClasses] = useState<ClassesDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchClassesByCurricularUnitId = async (unitId: number) => {
        try {
          const response = await api.get(`/classes/all/${unitId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setClasses(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching classes:", error);
          setError('Erro ao listar as aulas');
        }
    };

    useEffect(() => {
        if(unitId) {
            fetchClassesByCurricularUnitId(unitId);
        }
        
    }, [unitId, refreshKey]);

    const refreshClasses = () => {
        setRefreshKey(prev => prev + 1);
    };

    return { classes, error, refreshClasses };
};

const createClasse = (ucId: number, date: string, time:string, summary:any, refreshClasses: () => void) => {
  
  const classDate = `${date}T${time}`;
  
  api.post(
      `/classes/add/${ucId}`,
      {classDate, summary},
      {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
          },
      }
  )
  .then(() => {
    refreshClasses();
  })
  .catch(() => {
    alert("Ocorreu um erro ao criar aula.");
    console.error("Error creating class.");
  });
};

const updateClasse = (ucId: number, classId: number, date: string, time:string, summary: string, refreshClasses: () => void) => {
  
  const classDate = `${date}T${time}`;
  api.put(
    `/classes/update/${ucId}/${classId}`,
    { classDate, summary },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  )
  .then(() => {
    refreshClasses();
  })
  .catch(() => {
    alert("Ocorreu um erro ao atualizar informações da aula.");
    console.error("Error updating class.");
  });
};


const deleteClasse = (ucId: number, classId: number, refreshClasses: () => void) => {
  api.delete(
      `/classes/delete/${ucId}/${classId}`,
      {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      }
  )
  .then(() => {
    console.log("Class deleted!");
    refreshClasses();
  })
  .catch(() => {
    alert("Ocorreu um erro ao eliminar aula.");
    console.error("Error deleting class.");
  });
};

export { useClasses, deleteClasse, createClasse, updateClasse };