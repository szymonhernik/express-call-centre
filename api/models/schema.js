const mongoose = require('mongoose');


const readingSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author: String,
  contents: Array
})

module.exports = mongoose.model('Reading', readingSchema);
