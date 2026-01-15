import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Register(){

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
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

        // Vérifier le format du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Le mot de passe doit contenir au minimum 12 caractères avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial');
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Inscription réussie ! Redirection vers la page de connexion...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
        }
    };
    return(
        <div>
            <h1> Inscription </h1>

            <main id="MainRegister">
                <form onSubmit={handleSubmit} id="formRegister">
                    <article>
                        <label htmlFor="firstname">Prénom :</label>
                        <input 
                            type ="text"
                            name = "firstname"
                            id="firstname"
                            placeholder="Votre prénom..."
                            minLength={1}
                            maxLength={30}
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                    </article>

                    <article>
                        <label htmlFor="lastname"> Nom de famille :</label>
                        <input 
                            type ="text"
                            name = "lastname"
                            id="lastname"
                            placeholder="Votre nom de famille..."
                            minLength={1}
                            maxLength={30}
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </article>

                    <article>
                        <label htmlFor="email"> Email :</label>
                        <input 
                            type ="email"
                            name = "email"
                            id="email"
                            placeholder="Votre email..."
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </article>
                    
                    <article>
                        <label htmlFor="password"> Mot de passe :</label>
                        <input 
                            type ="password"
                            name = "password"
                            id="password"
                            placeholder="Votre mot de passe..."
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </article>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {success && <p style={{color: 'green'}}>{success}</p>}

                    <article>
                        <button type="submit" id="submitRegister">
                            S'inscrire
                        </button>
                    </article>

                    <p>
                        Si vous avez déjà un compte, <Link to="/login">connectez-vous</Link>.
                    </p>

                </form>
            </main>
        </div>
    )
}