import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckConn from '../components/checkConection';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', 
                { email, password},
                { headers: { "Content-Type": "application/json" }}
            );
            
            const token = response.data.token;
        
            if (token) {
                localStorage.setItem('token', token);
                setError('');
                navigate('/home');
            } else {
                setError('Erro: O token não foi recebido');
            }
        
        } catch (erro) {
            setError('Login falhado, tente novamente.');
        }
    };
    

    return (
        <div className='page'>
            <div className='topBar'>
                SISTEMA DE PRESENÇAS
            </div>
            <div className="panel1">
                <div className='titulo'>
                    <h1>Início de Sessão</h1>
                </div>
                <form onSubmit={handleLogin} className="form">
                    <input className='loginLabel'
                        type="email"
                        id="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input className='loginLabel'
                        type="password"
                        id="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className="authError">{error}</div>}
                    <button type="submit" className="botSubmit">
                        Iniciar Sessão
                    </button>
                </form>
            </div>
            <div className='autores'>Francisco Lampreia, n.º23275 & Rodrigo Salgueiro, n.º23270</div>
            <CheckConn />
        </div>
    );
};

export default LoginPage;