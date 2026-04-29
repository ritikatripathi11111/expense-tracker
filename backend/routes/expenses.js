const router = require('express').Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses of logged in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;