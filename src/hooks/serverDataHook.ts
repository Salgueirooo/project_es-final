import { useState, useEffect } from "react";
import axios from "axios";

const useUserRoles = () => {
    const [roles, setRoles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/roles")
            .then((response) => {
                setRoles(response.data);
            })
            .catch(() => {
                setError("Erro ao obter cargos dos utlizadores.");
            });
    }, []);

    return { roles, error };
};

const useReviewTypes = () => {
    const [reviewTypes, setReviewTypes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/participation-types")
            .then((response) => {
                setReviewTypes(response.data);
            })
            .catch(() => {
                setError("Erro ao obter tipos de factos.");
            });
    }, []);

    return { reviewTypes, error };
};

export { useUserRoles, useReviewTypes };