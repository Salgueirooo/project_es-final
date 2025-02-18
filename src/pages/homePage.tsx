import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import useCurricularUnits from '../hooks/curricularHook'
import { useUsername } from '../hooks/userHook';
import ShowClasses from '../components/showClasses';
import NothingToShow from '../components/nothingToShow';

const HomePage: React.FC = () => {
    
    const navigate = useNavigate();

    const [curricularUnitSelected, setCurricularUnitSelected] = useState<number | null>(null);
    
    const {curricularUnits, error} = useCurricularUnits();
    const { username } = useUsername();

    const selectedUnit = curricularUnits.find(unit => unit.id === curricularUnitSelected)?.name ?? null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

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
                </div>
                <div className='panel3'>
                    {curricularUnitSelected ?
                        <ShowClasses curricularUnitSelected={curricularUnitSelected} nameUnitSelected={selectedUnit} /> :
                        <NothingToShow/>}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
