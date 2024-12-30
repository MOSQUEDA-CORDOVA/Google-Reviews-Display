const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Place ID y clave de API
const placeId = "ChIJeUpfvFzJBZERDKHQnkk2kBs";  // Reemplaza con tu Place ID
const apiKey = "AIzaSyCfpLBU64wfxDFrHwqTeY7W612IOyjc_24";    // Reemplaza con tu clave de API

// Middleware para permitir solicitudes desde el frontend (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Ruta para obtener reseñas
app.get('/reviews', async (req, res) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=es`;

    try {
        const response = await axios.get(url);
        let reviews = response.data.result.reviews || [];

        // Ordenar las reseñas por la fecha 
        reviews = reviews.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Limitar a las últimas 4 reseñas
        reviews = reviews.slice(0, 4);

        // Formatear las reseñas
        const formattedReviews = reviews.map(review => ({
            author_name: review.author_name,
            profile_photo_url: review.profile_photo_url,
            text: review.text,
        }));

        res.json({ reviews: formattedReviews });

    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        res.status(500).json({ error: 'Error al obtener las reseñas.' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});