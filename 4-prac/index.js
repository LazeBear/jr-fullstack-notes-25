const express = require('express');
const app = express();
app.use(express.json());
app.use(cors);

const movieRouter = express.Router();
// debug mode

app.use('/v1/movies', movieRouter);
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

movieRouter.get('/', (req, res, next) => {
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

  // try {
  //   // async
  // } catch(e) {}
  res.json(paginatedMovies);
  // {
  //   success: true,
  //   data: []
  // }
  // {
  //   success:false,
  //   error: "xxxx",
  // }
});

movieRouter.get('/:id', (req, res, next) => {
  // const {id} = req.params;
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }
  res.json(movie);
});

movieRouter.post('/', (req, res, next) => {
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
});

movieRouter.put('/:id', (req, res, next) => {
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
});

movieRouter.delete('/:id', (req, res) => {
  const movieIndex = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (movieIndex === -1) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  movies.splice(movieIndex, 1);
  res.sendStatus(204);
});

movieRouter.get('/:id/reviews', (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }
  res.json(movie.reviews);
});

movieRouter.post('/:id/reviews', (req, res) => {
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
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
}
