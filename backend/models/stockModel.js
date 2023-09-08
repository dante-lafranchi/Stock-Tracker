const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stockSchema = new Schema({
  companyName: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  pricePaid: {
    type: Number,
    required: true
  },
  numShares: {
    type: Number,
    required: true
  },
  dateBought: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('stock', stockSchema)