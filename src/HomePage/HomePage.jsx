import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [userRatings, setUserRatings] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('userId'));
    const firstname = localStorage.getItem('firstname');

    useEffect(() => {
        const userType = localStorage.getItem('type');
        if (!userId || !userType) {
            navigate('/login');
        }
        fetchMovies();
    }, [navigate, userId]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/movies');
            const data = await response.json();
            if (data.success) {
                setMovies(data.movies);
                
                // Récupérer les notes de l'utilisateur
                const ratings = {};
                data.movies.forEach(movie => {
                    const userRating = movie.ratings.find(r => r.userId === userId);
                    if (userRating) {
                        ratings[movie.id] = userRating.rating;
                    }
                });
                setUserRatings(ratings);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur lors du chargement des films');
        }
    };

    const handleRating = async (movieId, rating) => {
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`http://localhost:8001/api/movies/${movieId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    rating: rating
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Note enregistrée !');
                setUserRatings({
                    ...userRatings,
                    [movieId]: rating
                });
                fetchMovies();
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(data.message || 'Erreur lors de la notation');
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

    const renderStars = (movieId) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    onClick={() => handleRating(movieId, i)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '30px',
                        color: i <= (userRatings[movieId] || 0) ? '#ffc107' : '#ddd',
                        marginRight: '5px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1>Bienvenue {firstname} !</h1>
                    <p style={{ color: '#666' }}>Découvrez et notez nos films</p>
                </div>
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

            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

            {movies.length === 0 ? (
                <p>Aucun film disponible pour le moment.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                    {movies.map(movie => (
                        <div 
                            key={movie.id} 
                            style={{ 
                                border: '2px solid #e0e0e0', 
                                padding: '20px', 
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <h2 style={{ marginTop: 0, color: '#333' }}>{movie.title}</h2>
                            <p style={{ margin: '10px 0' }}>
                                <strong>Réalisateur :</strong> {movie.director}
                            </p>
                            <p style={{ margin: '10px 0' }}>
                                <strong>Année :</strong> {movie.year}
                            </p>
                            <p style={{ margin: '10px 0', color: '#555' }}>
                                {movie.description}
                            </p>

                            <div style={{ 
                                padding: '15px', 
                                backgroundColor: '#f0f7ff', 
                                borderRadius: '8px',
                                marginTop: '15px',
                                marginBottom: '15px'
                            }}>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                    <strong>Note moyenne :</strong>
                                    <span style={{ fontSize: '18px', color: '#007bff', marginLeft: '10px' }}>
                                        {movie.averageRating > 0 ? `${movie.averageRating} / 5` : 'Pas encore noté'}
                                    </span>
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                    ({movie.totalRatings} {movie.totalRatings > 1 ? 'notes' : 'note'})
                                </p>
                            </div>

                            <div style={{ 
                                borderTop: '1px solid #ddd', 
                                paddingTop: '15px' 
                            }}>
                                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {userRatings[movie.id] 
                                        ? `Votre note : ${userRatings[movie.id]} / 5` 
                                        : 'Notez ce film :'}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {renderStars(movie.id)}
                                </div>
                                {userRatings[movie.id] && (
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                        Cliquez sur une étoile pour modifier votre note
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}