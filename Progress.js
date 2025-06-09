const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  exerciseId: {
    type: Number,  // Use exercise JSON ID
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
