//src/UserPage.tsx

import React, { useEffect, useState } from 'react';
import useToken from '../hooks/tokenHook';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
// import { UserDto } from '../dto/usersDto';
// import { CurricularUnitDto } from '../dto/CurricularUnitDTO';
import useCurricularUnits from '../hooks/curricularHook'
import { useUsername } from '../hooks/userHook';
import ShowClasses from '../components/showClasses';
import NothingToShow from '../components/nothingToShow';
import Modal from "../modal/modalInfoClassesUser";

const HomePage: React.FC = () => {


    const { decodedToken, error: tokenError } = useToken();
    const isUser = decodedToken?.role?.includes("ROLE_USER");
    
    const navigate = useNavigate();

    const [curricularUnitSelected, setCurricularUnitSelected] = useState<number | null>(null);

    //const [Units, setUnit] = useState<CurricularUnitsPopupProps>([]);;

    //const [curricularUnits, setCurricularUnits] = useState<CurricularUnitDto[]>([]);
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState<string | null>(null);
    
    
    const {curricularUnits, error} = useCurricularUnits();
    const { username } = useUsername();
    //const { classes } = useClasses(curricularUnitSelected);

    //const selectedUnit = curricularUnits.find(unit => unit.id === curricularUnitSelected);
    const selectedUnit = curricularUnits.find(unit => unit.id === curricularUnitSelected)?.name ?? null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redireciona sem recarregar a página
    };

    // useEffect(() => {
    //     if(!isAdmin && !isUser){
    //         navigate('/authorized');
    //     }
    // }, );

    
    /*
    useEffect(() => {
        const fetchCurricularUnits = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/curricular-units/session`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch students: ${response.statusText}`);
                }
                const data: CurricularUnitDto[] = await response.json();
                setCurricularUnits(data);
            } catch (err: any) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
        };

        fetchCurricularUnits();
    }, []);*/

    return (
        <div className="page">
            <div className='topBar'>
                <span className="welcome-text">Bem-vindo, {username}</span>
                <span className="title">SISTEMA DE PRESENÇAS</span>
                <button className='logout' onClick={handleLogout}><MdLogout /></button>
            </div>
            <div className='panel2'>
                <div className='col1'>
                    <div className='divTable'>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Unidades Curriculares</th>
                                </tr>
                            </thead>
                            <tbody>
                                {curricularUnits.map((unit) => (
                                <tr key={unit.id} onClick={() => setCurricularUnitSelected(unit.id)} 
                                className={unit.id === curricularUnitSelected ? "selected-row" : ""}>
                                    <td>{unit.name}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        {error && <h5 className='error'>{error}</h5>}
                    </div>
                    {/* <div className='bots'>
                        <button className='botEstat' onClick={() => setIsModalStatOpen(true)}>Estatíticas Globais</button>
                    </div> */}
                    
                </div>
                <div className='panel3'>
                    {/* { selectedUnit && (<h3 className='titClasses'>Unidade Curricular de {selectedUnit.name}</h3> )} */}
                    
                    {/* <div className='divTablePanel3'> */}
                        {curricularUnitSelected ?
                            <ShowClasses curricularUnitSelected={curricularUnitSelected} nameUnitSelected={selectedUnit} /> :
                            <NothingToShow/>}
                        {/* <ShowClasses curricularUnitSelected={curricularUnitSelected} /> */}
                    {/* </div> */}

                    
                    
                    {/* {classes.map((classe) => (
                        <tr key={classe.id}>
                            <td>{classe.summary}</td>
                        </tr>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
