const Brand = require('../models/brand');
const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
  console.log(req.body, '==================>');
  try {
    const { brand } = req.body;
    // const brand = await new Brand({ name, slug: slugify(name) }).save();
    res.json(await new Brand({ name: brand, slug: slugify(brand) }).save());
  } catch (err) {
    console.log(err);
    res.status(400).send('Create brand failed');
  }
};

exports.list = async (req, res) =>
  res.json(await Brand.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let brand = await brand.findOne({ slug: req.params.slug }).exec();
  //res.json(brand);
  const products = await Product.find({ brand }).populate('brand').exec();
  res.json({
    brand,
    products,
  });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const update = await brand.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(update);
  } catch {
    console.log(err);
    res.status(400).send('brand update failed');
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Brand.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send('brand delete failed');
  }
};
