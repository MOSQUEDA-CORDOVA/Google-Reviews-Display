const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors");

// Place ID y clave de API
const placeId = functions.config().google.placeid;
const apiKey = functions.config().google.apikey;

// Configuración de CORS para permitir solo tu dominio
const corsOptions = {
  origin: ["https://cdn.mosquedacordova.com", "https://mosquedacordova.com"],
};

// Endpoint para procesar
exports.getReviews = functions.https.onRequest(async (req, res) => {
  cors(corsOptions)(req, res, async () => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=es`;

    try {
      const response = await axios.get(url);
      let reviews = response.data.result.reviews || [];

      // Ordenar las reseñas por la fecha
      reviews = reviews.sort((a, b) => new Date(a.time) - new Date(b.time));

      // Limitar a las últimas 4 reseñas
      reviews = reviews.slice(0, 4);

      // Formatear las reseñas
      const formattedReviews = reviews.map((review) => ({
        author_name: review.author_name,
        profile_photo_url: review.profile_photo_url,
        text: review.text,
      }));

      res.json({reviews: formattedReviews});
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      res.status(500).json({error: "Error al obtener las reseñas."});
    }
  });
});
