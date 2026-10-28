const router = require('express').Router();
const Movie = require('../models/Movie');
const Show = require('../models/Show');

// GET /api/movies?search=
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id -> movie + upcoming shows
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const shows = await Show.find({ movie: movie._id, startTime: { $gte: new Date() } })
      .sort({ startTime: 1 })
      .select('-bookedSeats');
    res.json({ movie, shows });
  } catch {
    res.status(400).json({ message: 'Invalid movie id' });
  }
});

module.exports = router;
