import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [movies, setMovies] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        director: '',
        year: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est admin
    useEffect(() => {
        const userType = localStorage.getItem('type');
        if (userType !== 'admin') {
            navigate('/');
        }
        fetchMovies();
    }, [navigate]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/movies');
            const data = await response.json();
            if (data.success) {
                setMovies(data.movies);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur lors du chargement des films');
        }
    };

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
            const response = await fetch('http://localhost:8001/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Film ajouté avec succès !');
                setFormData({ title: '', director: '', year: '', description: '' });
                fetchMovies();
            } else {
                setError(data.message || 'Erreur lors de l\'ajout du film');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur');
        }
    };

    const handleDelete = async (movieId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8001/api/movies/${movieId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Film supprimé avec succès !');
                fetchMovies();
            } else {
                setError(data.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Panneau d'administration</h1>
                <button 
                    onClick={handleLogout}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    Déconnexion
                </button>
            </div>

            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h2>Ajouter un nouveau film</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="title">Titre du film : </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Titre..."
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="director">Réalisateur : </label>
                        <input
                            type="text"
                            name="director"
                            id="director"
                            placeholder="Réalisateur..."
                            value={formData.director}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="year">Année : </label>
                        <input
                            type="number"
                            name="year"
                            id="year"
                            placeholder="2024"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            min="1900"
                            max="2100"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="description">Description : </label>
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Description du film..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

                    <button 
                        type="submit"
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer',
                            borderRadius: '5px'
                        }}
                    >
                        Ajouter le film
                    </button>
                </form>
            </div>

            <div>
                <h2>Liste des films (Total : {movies.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {movies.map(movie => (
                        <div 
                            key={movie.id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                padding: '15px', 
                                borderRadius: '8px',
                                backgroundColor: 'white'
                            }}
                        >
                            <h3 style={{ marginTop: 0 }}>{movie.title}</h3>
                            <p><strong>Réalisateur :</strong> {movie.director}</p>
                            <p><strong>Année :</strong> {movie.year}</p>
                            <p><strong>Description :</strong> {movie.description}</p>
                            <div style={{ 
                                padding: '10px', 
                                backgroundColor: '#e7f3ff', 
                                borderRadius: '5px',
                                marginBottom: '10px'
                            }}>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Note moyenne :</strong> 
                                    <span style={{ fontSize: '20px', color: '#007bff', marginLeft: '10px' }}>
                                        {movie.averageRating > 0 ? `${movie.averageRating} / 5` : 'Aucune note'}
                                    </span>
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Nombre de notes :</strong> {movie.totalRatings}
                                </p>
                            </div>
                            <button 
                                onClick={() => handleDelete(movie.id)}
                                style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#dc3545', 
                                    color: 'white', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    width: '100%'
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}