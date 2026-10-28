const router = require('express').Router();
const Show = require('../models/Show');

// GET /api/shows/:id -> show with seat availability
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie', 'title genre durationMins');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch {
    res.status(400).json({ message: 'Invalid show id' });
  }
});

module.exports = router;
