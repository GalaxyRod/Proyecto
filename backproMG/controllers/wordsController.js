const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));
const { Op } = require('sequelize');

const BACKUP_WORDS = [
  'typescript',
  'angular',
  'signal',
  'component',
  'template',
  'interface',
  'decorator',
  'injection',
  'directive',
  'pipe',
  'javascript',
  'framework',
  'frontend',
  'module',
  'dependency',
  'observable',
  'routing',
  'binding',
  'service',
  'lifecycle'
];

exports.getWords = async (req, res, next) => {
  try {
    const {
      minLength = 4,
      maxLength = 8,
      category = 'programming',
      limit = 100
    } = req.query;

    const words = await db.Word.findAll({
      where: {
        category,
        word: {
          [Op.and]: [
            { [Op.regexp]: '^[a-zA-Z]+$' },
            db.sequelize.where(
              db.sequelize.fn('LENGTH', db.sequelize.col('word')),
              { [Op.between]: [parseInt(minLength), parseInt(maxLength)] }
            )
          ]
        }
      },
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: words.map(word => word.getDataValue('word'))
    });
  } catch (error) {
    next(error);
  }
};

exports.getRandomWord = async (req, res, next) => {
  try {
    const {
      minLength = 4,
      maxLength = 8,
      category = 'programming'
    } = req.query;

    const count = await db.Word.count({
      where: {
        category,
        word: {
          [Op.and]: [
            { [Op.regexp]: '^[a-zA-Z]+$' },
            db.sequelize.where(
              db.sequelize.fn('LENGTH', db.sequelize.col('word')),
              { [Op.between]: [parseInt(minLength), parseInt(maxLength)] }
            )
          ]
        }
      }
    });

    if (count === 0) {
      const randomIndex = Math.floor(Math.random() * BACKUP_WORDS.length);
      return res.status(200).json({
        success: true,
        data: BACKUP_WORDS[randomIndex]
      });
    }

    const randomOffset = Math.floor(Math.random() * count);

    const word = await db.Word.findOne({
      where: {
        category,
        word: {
          [Op.and]: [
            { [Op.regexp]: '^[a-zA-Z]+$' },
            db.sequelize.where(
              db.sequelize.fn('LENGTH', db.sequelize.col('word')),
              { [Op.between]: [parseInt(minLength), parseInt(maxLength)] }
            )
          ]
        }
      },
      offset: randomOffset,
      limit: 1
    });

    res.status(200).json({
      success: true,
      data: word.getDataValue('word')
    });
  } catch (error) {
    next(error);
  }
};

exports.addWord = async (req, res, next) => {
  try {
    const { word, category = 'programming' } = req.body;

    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid word (letters only)'
      });
    }

    const [newWord, created] = await db.Word.findOrCreate({
      where: { word: word.toLowerCase() },
      defaults: { category }
    });

    if (!created) {
      return res.status(409).json({
        success: false,
        message: 'Word already exists',
        data: newWord
      });
    }

    res.status(201).json({
      success: true,
      data: newWord
    });
  } catch (error) {
    next(error);
  }
};

exports.seedWords = async (req, res, next) => {
  try {
    const count = await db.Word.count();

    if (count > 0) {
      return res.status(409).json({
        success: false,
        message: 'Database already has words. Skipping seed operation.'
      });
    }

    const wordsToCreate = BACKUP_WORDS.map(word => ({
      word,
      category: 'programming'
    }));

    await db.Word.bulkCreate(wordsToCreate);

    res.status(201).json({
      success: true,
      message: `Seeded database with ${BACKUP_WORDS.length} words`
    });
  } catch (error) {
    next(error);
  }
};
