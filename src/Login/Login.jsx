import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');

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
                // Stocker les informations utilisateur dans localStorage
                localStorage.setItem("type", data.type);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("firstname", data.firstname);
                localStorage.setItem("lastname", data.lastname);
                
                setSuccess('Connexion réussie !');
                
                // Redirection selon le type d'utilisateur
                setTimeout(() => {
                    if (data.type === "admin") {
                        navigate('/Admin');
                    } else {
                        navigate('/homepage');
                    }
                }, 500);

            } else {
                setError(data.message || 'Erreur lors de la connexion');
            }

        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email : </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Votre email..."
                        value={formData.email}
                        onChange={handleChange}
                        required
                        
                    />
                </div>

                <div>
                    <label htmlFor="password">Mot de passe : </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Votre mot de passe..."
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

                <button 
                    type="submit"
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    Se connecter
                </button>

                <p>
                    Si vous n'avez pas de compte, <Link to="/register">inscrivez-vous</Link>
                </p>
            </form>
        </div>
    );
}