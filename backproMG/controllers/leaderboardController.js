const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));

exports.getScores = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const entries = await db.LeaderboardEntry.findAll({
      order: [['score', 'DESC']],
      limit: limit
    });

    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    next(error);
  }
};

exports.addScore = async (req, res, next) => {
  try {
    const { name, score } = req.body;

    if (!name || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name and score'
      });
    }

    const newEntry = await db.LeaderboardEntry.create({
      name,
      score
    });

    res.status(201).json({
      success: true,
      data: newEntry
    });
  } catch (error) {
    next(error);
  }
};

exports.getScoreById = async (req, res, next) => {
  try {
    const entry = await db.LeaderboardEntry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Leaderboard entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteScore = async (req, res, next) => {
  try {
    const entry = await db.LeaderboardEntry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Leaderboard entry not found'
      });
    }

    await entry.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
