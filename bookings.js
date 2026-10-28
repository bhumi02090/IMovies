const router = require('express').Router();
const auth = require('../middleware/auth');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

const isValidSeat = (seat, show) => {
  const m = /^([A-Z])(\d{1,2})$/.exec(seat);
  if (!m) return false;
  const row = m[1].charCodeAt(0) - 65;
  const col = Number(m[2]);
  return row >= 0 && row < show.rows && col >= 1 && col <= show.cols;
};

// POST /api/bookings { showId, seats: ["A1","A2"] }
router.post('/', auth, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    if (!showId || !Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: 'Select at least one seat' });
    if (seats.length > 8)
      return res.status(400).json({ message: 'You can book up to 8 seats at a time' });

    const uniqueSeats = [...new Set(seats)];
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    if (show.startTime < new Date())
      return res.status(400).json({ message: 'This show has already started' });
    if (!uniqueSeats.every((s) => isValidSeat(s, show)))
      return res.status(400).json({ message: 'One or more seats are invalid' });

    // Atomic reservation: succeeds only if NONE of the requested seats are taken,
    // so two people can never book the same seat at the same time.
    const reserved = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: uniqueSeats } },
      { $push: { bookedSeats: { $each: uniqueSeats } } },
      { new: true }
    );
    if (!reserved)
      return res.status(409).json({ message: 'Some of those seats were just taken. Please pick others.' });

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats: uniqueSeats,
      totalAmount: uniqueSeats.length * show.price,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/mine
router.get('/mine', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'show',
        select: 'screen startTime price',
        populate: { path: 'movie', select: 'title posterColor' },
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Booking is already cancelled' });

    const show = await Show.findById(booking.show);
    if (show && show.startTime < new Date())
      return res.status(400).json({ message: 'Cannot cancel after the show has started' });

    await Show.updateOne({ _id: booking.show }, { $pull: { bookedSeats: { $in: booking.seats } } });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
