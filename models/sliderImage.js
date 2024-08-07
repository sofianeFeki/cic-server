const mongoose = require('mongoose');

const sliderImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('SliderImage', sliderImageSchema);

