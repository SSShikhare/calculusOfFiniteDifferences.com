// server/models/Calculation.js
const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  input: {
    xValues: [Number],
    yValues: [Number],
    method: String,
    stepSize: Number,
    order: Number
  },
  steps: [mongoose.Schema.Types.Mixed],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Calculation', calculationSchema);