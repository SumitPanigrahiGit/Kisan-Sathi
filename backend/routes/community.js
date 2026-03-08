const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

// @GET /api/community/questions
router.get('/questions', async (req, res) => {
  try {
    const { category, search, state, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (state) filter.state = state;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .populate('user', 'name role district state language')
      .populate('answers.user', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// @POST /api/community/questions
router.post('/questions', protect, async (req, res) => {
  try {
    const { title, content, category, crop, tags, language } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const question = await Question.create({
      user: req.user._id,
      title,
      content,
      category: category || 'Other',
      crop,
      tags: tags || [],
      language: language || req.user.language || 'English',
      district: req.user.district,
      state: req.user.state
    });

    await question.populate('user', 'name role district state');
    res.status(201).json({ success: true, message: 'Question posted successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error posting question' });
  }
});

// @GET /api/community/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('user', 'name role district state language')
      .populate('answers.user', 'name role district');

    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.views += 1;
    await question.save();

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// @POST /api/community/questions/:id/answers
router.post('/questions/:id/answers', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Answer content is required' });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.answers.push({
      user: req.user._id,
      content,
      isExpertAnswer: req.user.role === 'expert' || req.user.role === 'admin'
    });

    await question.save();
    await question.populate('answers.user', 'name role district');

    res.status(201).json({
      success: true,
      message: 'Answer posted successfully',
      answers: question.answers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error posting answer' });
  }
});

// @PUT /api/community/questions/:id/upvote
router.put('/questions/:id/upvote', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const idx = question.upvotes.indexOf(req.user._id);
    if (idx === -1) {
      question.upvotes.push(req.user._id);
    } else {
      question.upvotes.splice(idx, 1);
    }
    await question.save();

    res.json({ success: true, upvotes: question.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting' });
  }
});

// @PUT /api/community/questions/:id/resolve
router.put('/questions/:id/resolve', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only question author can mark as resolved' });
    }

    question.isResolved = true;
    await question.save();

    res.json({ success: true, message: 'Question marked as resolved' });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving question' });
  }
});

// Seed some initial questions
const seedQuestions = async () => {
  const count = await Question.countDocuments();
  if (count > 0) return;

  // We'll let real users create questions
  console.log('Community ready for questions');
};
seedQuestions().catch(console.error);

module.exports = router;
