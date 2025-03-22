require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const db = require(path.join(__dirname, '..', 'models'));

const leaderboardRoutes = require(path.join(__dirname, '..', 'routes', 'leaderboardRoutes'));
const wordsRoutes = require(path.join(__dirname, '..', 'routes', 'wordsRoutes'));

const app = express();
const PORT = process.env.PORT || 3033;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/words', wordsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});