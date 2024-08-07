const path = require('path');
const SliderImage = require('../models/sliderImage');

exports.createSliderImage = async (req, res) => {
  try {
    const { file } = req;

    let imagePath = '';
    if (file) {
      imagePath = path.join('/uploads/slider', file.filename);
    }

    const newSliderImage = new SliderImage({ image: imagePath });
    const savedSliderImage = await newSliderImage.save();
    res.json(savedSliderImage);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.getSliderImages = async (req, res) => {
  try {
    const sliderImages = await SliderImage.find();
    res.json(sliderImages);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.deleteSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const sliderImage = await SliderImage.findByIdAndDelete(id);
    res.json(sliderImage);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.updateSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;

    let imagePath = '';
    if (file) {
      imagePath = path.join('/uploads/slider', file.filename);
    }

    const updatedSliderImage = await SliderImage.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true }
    );
    res.json(updatedSliderImage);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};
