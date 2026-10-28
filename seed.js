require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Show = require('./models/Show');

const movies = [
  { title: 'Midnight Express', genre: 'Thriller', language: 'English', durationMins: 128, rating: 4.3, posterColor: '#7f1d1d', description: 'An overnight train, a missing passenger and a conductor who knows more than he says.' },
  { title: 'Monsoon Diaries', genre: 'Romance', language: 'Hindi', durationMins: 142, rating: 4.1, posterColor: '#134e4a', description: 'Two strangers keep missing each other across one long, rainy season in Mumbai.' },
  { title: 'Orbit Zero', genre: 'Sci-Fi', language: 'English', durationMins: 135, rating: 4.6, posterColor: '#1e3a8a', description: 'A repair crew on a failing space station has 90 minutes of oxygen and one working shuttle.' },
  { title: 'The Last Wicket', genre: 'Drama', language: 'Hindi', durationMins: 150, rating: 4.4, posterColor: '#78350f', description: 'A small-town cricketer gets one final over to save his village team.' },
  { title: 'Laugh Riot', genre: 'Comedy', language: 'English', durationMins: 105, rating: 3.9, posterColor: '#581c87', description: 'A wedding planner, a runaway groom and a very confused goat.' },
  { title: 'Shadow Court', genre: 'Crime', language: 'Hindi', durationMins: 133, rating: 4.2, posterColor: '#1f2937', description: 'A young lawyer takes a case no one else wants and finds the system watching back.' },
];

const times = [[11, 0], [15, 30], [20, 0]];
const screens = ['Screen 1', 'Screen 2', 'Screen 3'];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Movie.deleteMany();
  await Show.deleteMany();

  const created = await Movie.insertMany(movies);
  const shows = [];
  for (const movie of created) {
    for (let d = 0; d < 4; d++) {
      times.forEach(([h, m], i) => {
        const start = new Date();
        start.setDate(start.getDate() + d);
        start.setHours(h, m, 0, 0);
        if (start > new Date())
          shows.push({ movie: movie._id, startTime: start, screen: screens[i], price: 150 + i * 50 });
      });
    }
  }
  await Show.insertMany(shows);
  console.log(`Seeded ${created.length} movies and ${shows.length} shows`);
  process.exit(0);
})();
