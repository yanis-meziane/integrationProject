const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8001;

// Middleware
app.use(cors());
app.use(express.json());

// Route de connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    try {
        const usersData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8')
        );
        
        const user = usersData.users.find(
            u => u.email === email && u.password === password
        );
        
        if (user) {
            res.json({
                success: true,
                userId: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                type: user.type
            });
        } else {
            res.json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// Route d'inscription
app.post('/api/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    try {
        const usersData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8')
        );
        
        const emailExists = usersData.users.some(u => u.email === email);
        
        if (emailExists) {
            return res.json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }
        
        const newUser = {
            id: usersData.users.length + 1,
            firstname,
            lastname,
            email,
            password,
            type: 'user'
        };
        
        usersData.users.push(newUser);
        
        fs.writeFileSync(
            path.join(__dirname, 'users.json'),
            JSON.stringify(usersData, null, 2)
        );
        
        res.json({
            success: true,
            message: 'Inscription réussie'
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// ===== ROUTES FILMS =====

// Récupérer tous les films
app.get('/api/movies', (req, res) => {
    try {
        const moviesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8')
        );
        
        // Calculer la moyenne pour chaque film
        const moviesWithAverage = moviesData.movies.map(movie => {
            const ratings = movie.ratings || [];
            const average = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0;
            
            return {
                ...movie,
                averageRating: average.toFixed(1),
                totalRatings: ratings.length
            };
        });
        
        res.json({
            success: true,
            movies: moviesWithAverage
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// Ajouter un film (admin seulement)
app.post('/api/movies', (req, res) => {
    const { title, director, year, description } = req.body;
    
    try {
        const moviesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8')
        );
        
        const newMovie = {
            id: moviesData.movies.length + 1,
            title,
            director,
            year: parseInt(year),
            description,
            ratings: []
        };
        
        moviesData.movies.push(newMovie);
        
        fs.writeFileSync(
            path.join(__dirname, 'movies.json'),
            JSON.stringify(moviesData, null, 2)
        );
        
        res.json({
            success: true,
            message: 'Film ajouté avec succès',
            movie: newMovie
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// Noter un film (user)
app.post('/api/movies/:id/rate', (req, res) => {
    const movieId = parseInt(req.params.id);
    const { userId, rating } = req.body;
    
    try {
        const moviesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8')
        );
        
        const movieIndex = moviesData.movies.findIndex(m => m.id === movieId);
        
        if (movieIndex === -1) {
            return res.json({
                success: false,
                message: 'Film non trouvé'
            });
        }
        
        const movie = moviesData.movies[movieIndex];
        
        // Vérifier si l'utilisateur a déjà noté ce film
        const existingRatingIndex = movie.ratings.findIndex(r => r.userId === userId);
        
        if (existingRatingIndex !== -1) {
            // Mettre à jour la note existante
            movie.ratings[existingRatingIndex].rating = rating;
        } else {
            // Ajouter une nouvelle note
            movie.ratings.push({ userId, rating });
        }
        
        fs.writeFileSync(
            path.join(__dirname, 'movies.json'),
            JSON.stringify(moviesData, null, 2)
        );
        
        res.json({
            success: true,
            message: 'Note enregistrée avec succès'
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// Supprimer un film (admin seulement)
app.delete('/api/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    
    try {
        const moviesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8')
        );
        
        const movieIndex = moviesData.movies.findIndex(m => m.id === movieId);
        
        if (movieIndex === -1) {
            return res.json({
                success: false,
                message: 'Film non trouvé'
            });
        }
        
        moviesData.movies.splice(movieIndex, 1);
        
        fs.writeFileSync(
            path.join(__dirname, 'movies.json'),
            JSON.stringify(moviesData, null, 2)
        );
        
        res.json({
            success: true,
            message: 'Film supprimé avec succès'
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur du serveur'
        });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});