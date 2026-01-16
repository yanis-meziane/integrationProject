import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Stocker les informations de l'utilisateur
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('firstname', data.firstname);
                localStorage.setItem('lastname', data.lastname);
                localStorage.setItem('type', data.type);

                // Rediriger selon le type d'utilisateur
                if (data.type === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/homepage');
                }
            } else {
                setError(data.message || 'Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Votre email..."
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Votre mot de passe..."
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <button 
                    type="submit"
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    Se connecter
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
            </p>
        </div>
    );
}