const { createLogger } = require('../utils/logger');

const logger = createLogger(__filename);

let nextMovieId = 2;
let nextReviewId = 3;

const movies = [
  {
    id: 1,
    title: 'Inception',
    description: 'A skilled thief steals secrets from dreams.',
    types: ['Sci-Fi'],
    averageRating: 4.5,
    reviews: [
      { id: 1, content: 'Amazing movie!', rating: 5 },
      { id: 2, content: 'Great visuals.', rating: 4 },
    ],
  },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - types
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         description:
 *           type: string
 *           description: The description of the movie
 *         types:
 *           type: array
 *           items:
 *             type: string
 *           description: The genres of the movie
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - content
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: The rating given to the movie (1-5)
 *         content:
 *           type: string
 *           description: The review content
 */

const addMovie = (req, res, next) => {
  const { title, description, types } = req.body;
  // data validation
  if (!title || !description || !Array.isArray(types) || types.length === 0) {
    return res.status(400).json({
      message:
        'All fields must be required and types must be a non-empty array',
    });
  }

  const newMovie = {
    id: nextMovieId++,
    title,
    description,
    types,
    averageRating: 0,
    reviews: [],
  };
  // movies.push(newMovie);
  movies.unshift(newMovie);
  res.status(201).json(newMovie);
};

/**
 * @swagger
 * /v1/movies:
 *   get:
 *     summary: Returns a list of movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for movies
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
const getAllMovies = (req, res, next) => {
  logger.info('Getting all movies', { payload: { query: req.query } });
  const { keyword, sort, page = 1, limit = 10 } = req.query;

  let filteredMovies = [...movies];
  if (keyword) {
    filteredMovies = filteredMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(keyword.toLowerCase()) ||
        m.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  if (sort === 'rating') {
    filteredMovies.sort((a, b) => a.averageRating - b.averageRating);
  } else if (sort === '-rating') {
    filteredMovies.sort((a, b) => b.averageRating - a.averageRating);
  }

  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  logger.debug('movie returned successfully', {
    payload: { count: filteredMovies.length },
  });
  res.json(paginatedMovies);
};

const getMovieById = (req, res, next) => {
  // const {id} = req.params;
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }
  res.json(movie);
};

const updateMovieById = (req, res, next) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }
  const { title, description, types } = req.body;

  // Object.assign

  if (title) {
    movie.title = title;
  }
  if (description) {
    movie.description = description;
  }
  if (types) {
    if (!Array.isArray(types) || types.length === 0) {
      return res.status(400).json({ message: 'types must be an array' });
    }
    movie.types = types;
  }
  res.json(movie);
};

const deleteMovieById = (req, res) => {
  const movieIndex = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (movieIndex === -1) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  movies.splice(movieIndex, 1);
  res.sendStatus(204);
};

const getReviewsByMovieId = (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }
  res.json(movie.reviews);
};

const addReviewByMovieId = (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  const { content, rating } = req.body;
  if (!content || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      message:
        'content and rating are required. Rating must be between 1 and 5 (inc.)',
    });
  }

  const newReview = {
    id: nextReviewId++,
    content,
    rating,
  };

  movie.reviews.push(newReview);
  movie.averageRating = +(
    movie.reviews.reduce((sum, current) => sum + current.rating, 0) /
    movie.reviews.length
  ).toFixed(2);
  res.status(201).json(newReview);
};

module.exports = {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  getReviewsByMovieId,
  addReviewByMovieId,
};
