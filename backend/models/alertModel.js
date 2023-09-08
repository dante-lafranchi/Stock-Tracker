const mongoose = require('mongoose')

const Schema = mongoose.Schema

const alertSchema = new Schema({
  companyName: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  alertPrice: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('alert', alertSchema)