const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createSliderImage,
  getSliderImages,
  deleteSliderImage,
  updateSliderImage,
} = require('../Controlles/sliderController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/slider');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/slider/create', upload.single('sliderImage'), createSliderImage);
router.get('/slider', getSliderImages);
router.delete('/slider/delete/:id', deleteSliderImage);
router.put('/:id', upload.single('sliderImage'), updateSliderImage);

module.exports = router;

